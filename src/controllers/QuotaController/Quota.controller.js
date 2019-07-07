'use strict';

const models = require('../../models');
const Transaction = models.Transaction;
const File = models.File;
const fileSystem = require('fs');
const path = require('path');

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
        return await File.find({user_create: user}).then((files)=>{
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
        });


    }

    checkFileSize(maxSize, files){
        return parseInt(files.file.size / 1000) <= maxSize;
    }

    async getUserFileNumber(user){
        return await File.countDocuments({user_create: user});
    }

     checkUpload(){
        return  (req, res, next) => {
             this.getCurrentSubscription(req.user._id).then(async (transaction) =>{
                //Check total file size is above subscription storage accepted size
                if(transaction.subscription.storage < req.files.file.size/1000 + await this.userUsedStorage(req.user._id)){
                    res.status(412).end();
                }
                //Check if files size is above subscription file accepted size
                if(!this.checkFileSize(transaction.subscription.file_size, req.files)){
                    res.status(412).end();
                }

                //Check if number of file will be above subscription accepted number of file
                if(await this.getUserFileNumber(req.user._id) + 1 > transaction.subscription.file_number){
                    res.status(412).end();
                }
                next();
            });
        }
    }
}

module.exports = new QuotaController();
