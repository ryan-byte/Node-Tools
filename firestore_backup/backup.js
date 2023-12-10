const path = require("path");
const {initializeApp} = require("firebase/app");
const {getStorage,ref,getDownloadURL, listAll} = require("firebase/storage");
require('dotenv').config({path:path.resolve(__dirname,"firebaseConfig.env")});
const { URL } = require('url');
const fs = require("fs");
const axios = require("axios")


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


backup();
async function backup(){
    console.log("getting urls");
    const urls = await getAllFileUrls();
    console.log("downloading backup files");
    const backupFolder = backupFileName();
    fs.mkdirSync(backupFolder);
    for (let i=0; i<urls.length; i++){
        console.log("saving: " + urls[i]);
        await downloadFile(urls[i], backupFolder);
    }
}

async function downloadFile(fileURL, folder){
    try {
        const response = await axios({
            method: 'GET',
            url: fileURL,
            responseType: 'stream',
        });
    
        const url = new URL(fileURL);
        const pathname = decodeURIComponent(url.pathname);
        const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    
        const writer = fs.createWriteStream(`${folder}/${filename}`);
        response.data.pipe(writer);
    
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.log(error);
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

function backupFileName(){
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString();
    const minutes= date.getMinutes().toString();
    const seconds= date.getSeconds().toString();
  
    return `backup-${day}-${month}-${year}-${hour}_${minutes}_${seconds}`;
}