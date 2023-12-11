const path = require("path");
const {initializeApp} = require("firebase/app");
const {getStorage,ref,getDownloadURL, listAll, uploadString} = require("firebase/storage");
require('dotenv').config({path:path.resolve(__dirname,"firebaseConfig.env")});
const { URL } = require('url');
const fs = require("fs");
const mime = require('mime');
const {getInput} = require("./utils");


const firestorage_filesFolder = "images/"


// firebase init
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};
initializeApp(firebaseConfig);
const storage = getStorage();

restore();
async function restore(){
    const backupFolder = await getInput("backup folder path: ");
    console.log("getting images stored in the backup");
    const localBackupFiles = fs.readdirSync(backupFolder);
    console.log("getting images stored in firebase storage");
    const urls = await getAllFileUrls();
    const fileNames = [];
    for (let i=0; i<urls.length; i++){
        let url = new URL(urls[i]);
        let pathname = decodeURIComponent(url.pathname);
        let filename = pathname.substring(pathname.lastIndexOf('/') + 1);
        fileNames.push(filename);
    }
    //find missing items from the cloud storage
    const missingFiles = localBackupFiles.filter(item => !fileNames.includes(item));

    //upload missing files
    uploadMissingFiles(missingFiles,backupFolder);
}

async function uploadMissingFiles(missingFiles, backupFolder){
    for (let i = 0; i<missingFiles.length; i++){
        let fileBase64 = fs.readFileSync(`${backupFolder}/${missingFiles[i]}`,{encoding:"base64"});
        fileType = mime.getType(`${backupFolder}/${missingFiles[i]}`);
        console.log("uploading: " + missingFiles[i]);
        await uploadFile(fileBase64, `${firestorage_filesFolder}/${missingFiles[i]}`, fileType);
    }
}

async function getAllFileUrls() {
    const storageRef = ref(storage, firestorage_filesFolder);
    try {
        const listResult = await listAll(storageRef);
        const urls = [];
        await Promise.all(listResult.items.map(async (itemRef) => {
            const downloadURL = await getDownloadURL(itemRef);
            urls.push(downloadURL);
        }));
        
        return urls;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function uploadFile(fileBase64, path, type){
    try{
        const storageImagesRef = ref(storage, path);
        await uploadString(storageImagesRef,fileBase64,"base64",{contentType:type});
    }catch(err){
        console.log(err);
        return {error:err};
    }
}