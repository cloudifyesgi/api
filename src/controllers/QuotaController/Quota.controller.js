'use strict';

const models = require('../../models');
const Transaction = models.Transaction;
const File = models.File;
const fileSystem = require('fs');
const path = require('path');
const mongoose = require('mongoose');

class QuotaController{

    constructor() {
    }

    async getCurrentSubscription(user){
        return await Transaction.findOne({
            user: user,
            date_end : undefined
        }).populate('subscription');
    }

    async userUsedStorage(user){
        let files = await this.getUserLastVersionFiles(user);
        let filePath;
        let stat;
        let totalSize = 0;
        //Sum size of all uploaded files
        for (let file of files){
            filePath = path.join(process.env.FILES_PATH + file._id);
            //Sum size only if size exist
            if (fileSystem.existsSync(filePath)) {
                stat = fileSystem.statSync(filePath);
                totalSize += parseInt(stat.size /1000)
            }
        }
        return totalSize;
    }

    checkFileSize(maxSize, files){
        return parseInt(files.file.size / 1000) <= maxSize;
    }

    async getUserFileNumber(user){
        let lastVersions = await this.getUserLastVersionFiles(user);
        return lastVersions.length;
    }

    async getUserLastVersionFiles(user){
        return await File.aggregate([
            {$match: {
                deleted: false,
                user_create: mongoose.Types.ObjectId(user)
            }},
            {$sort: {"file_version": -1}},
            {
                $group: {
                    _id: "$name",
                    name: {$first: "$name"},
                    file_version: {$first: "$file_version"},
                    file_id: {$first: "$_id"},
                    date_create: {$first: "$date_create"},
                    file_type: {$first: "$file_type"},
                    user_create: {$first: "$user_create"},
                    user_update: {$first: "$user_update"},
                    directory: {$first: "$directory"},
                    createdAt: {$first: "$createdAt"},
                    updatedAt: {$first: "$updatedAt"},
                }
            }
        ]);
    }

     checkUpload(){
        return async (req, res, next) => {
             let transaction =await this.getCurrentSubscription(req.user._id);
                if(transaction.subscription.storage < req.files.file.size/1000 + await this.userUsedStorage(req.user._id)){
                    //Check total file size is above subscription storage accepted size
                    res.status(412).end();
                }else if(!this.checkFileSize(transaction.subscription.file_size, req.files)){
                    //Check if files size is above subscription file accepted size
                    res.status(412).end();
                }else if(await this.getUserFileNumber(req.user._id) + 1 > transaction.subscription.file_number){
                    //Check if number of file will be above subscription accepted number of file
                    res.status(412).end();
                }else{
                    next();
                }
        }
    }
}

module.exports = new QuotaController();
