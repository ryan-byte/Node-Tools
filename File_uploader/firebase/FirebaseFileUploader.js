const path = require("path");
const {initializeApp} = require("firebase/app");
const {getStorage,ref,uploadString,deleteObject,getDownloadURL} = require("firebase/storage");
require('dotenv').config({path:path.resolve(__dirname,"firebaseConfig.env")});


class FirebaseImageUploader{
    constructor(){
        const firebaseConfig = {
            apiKey: process.env.apiKey,
            authDomain: process.env.authDomain,
            projectId: process.env.projectId,
            storageBucket: process.env.storageBucket,
            messagingSenderId: process.env.messagingSenderId,
            appId: process.env.appId,
            measurementId: process.env.measurementId
        };
        const app = initializeApp(firebaseConfig);
        this.storage = getStorage();
    }

    async uploadFile(fileBase64, path, type){
        try{
            const storageImagesRef = ref(this.storage, path);
            await uploadString(storageImagesRef,fileBase64,"base64",{contentType:type});
            //return the image url after uploading
            return await this.getFileUrl(path);
        }catch(err){
            return {error:err};
        }
    }
    
    async deleteFile(path){
        const storageImagesRef = ref(this.storage, path);
        try{
            await deleteObject(storageImagesRef);
            return "file deleted";
        }catch (err){
            return {error:err};
        }
    }
    
    async getFileUrl(path){
        const storageImagesRef = ref(this.storage, path);
        try{
            return await getDownloadURL(storageImagesRef);
        }catch (err){
            return {error:err};
        }
    }
}


module.exports = FirebaseImageUploader;