'use strict';

const models = require('../../models');
const Controller = require('../Controller');
const Synchronization = models.Synchronization;
const DirectoryController = require('../DirectoryController/Directory.controller');
const mongoose = require('mongoose');

class SynchronizationController extends Controller{

    constructor() {
        super(Synchronization);
    }

    async create(local_path,directory,user_id) {
        let newSynchronization = new Synchronization({
            local_path:local_path,
            directory: mongoose.Types.ObjectId(directory),
            user: mongoose.Types.ObjectId(user_id)
        });
        return await newSynchronization.save();
    }

    async update(id, fields) {
        let Synchronization = await this.getById(id);
        return await super.update(Synchronization, fields);
    }

    async delete(id) {
        let Synchronization = await this.getById(id);
        return await super.delete(Synchronization);
    }

    async getByDirectory(directory){
        return await Synchronization.find({directory: mongoose.Types.ObjectId(directory)});
    }

    async getByDirectoryAndUser(directory,user){
        return await Synchronization.find({
            directory: mongoose.Types.ObjectId(directory),
            user: mongoose.Types.ObjectId(user)
        });
    }

    async getByUser(user){
        return await Synchronization.find({
            user: mongoose.Types.ObjectId(user)
        });
    }

    async getSyncFolderMapById(id){
        let sync = await super.getById(id);
        console.log(sync);
        let directory = await DirectoryController.getById(sync.directory);
        let array = {};
        array[sync.local_path] = {id:directory._id,parent_id : 0, is_directory: true};
        return await this.getSyncFolder(array,sync.local_path,sync.directory);
    }

    async getSyncFolder(array,path,root){
        for(let directory of await DirectoryController.getByParentIdNoUser(root)){
            array = await this.getSyncFolder(array,path+'\\'+directory.name,directory._id);
            array[path+'\\'+directory.name ] = {id : directory._id , parent_id : root,is_directory : true};
        }

        for(let file of await DirectoryController.getFilesByDirectoryNoUser(root)){
            array[path+'\\'+file.name ] = {id : file._id , parent_id : root,is_directory : false};
        }
        return array;
    }

    async getSynchronizedParent(dir){
        if(dir === undefined){
            return undefined
        }
        const synchronization = await this.getByDirectory(dir._id);
        if( synchronization.length === 0 ){
            return await this.getSynchronizedParent(dir.parent_directory);
        }else{
            return synchronization[0]._id;
        }
    }

}

module.exports = new SynchronizationController();
