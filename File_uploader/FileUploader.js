const fs = require("fs");


class FileUploader{

    constructor(fileUploaderService){
        this.fileUploaderService = fileUploaderService;
    }

    /**
     * 
     * @param {Object} fileBase64 The base64 of a file (you can use the function "getFileAsBase64" in this file)
     * @param {String} path The path inside the storage where to store the file
     * @param {String} type The contentType of the file
     * @returns file url
     */
    async uploadFile(fileBase64, path, type){
        return await this.fileUploaderService.uploadFile(fileBase64, path, type)
    }

    /**
     * 
     * @param {String} path The path inside the storage where the file is stored
     * @returns 
     */
    async deleteFile(path){
        return await this.fileUploaderService.deleteFile(path)
    }

    /**
     * 
     * @param {String} path The path inside the storage where the file is stored
     * @returns 
     */
    async getFileUrl(path){
        return await this.fileUploaderService.getFileUrl(path)
    }

    // utils functions
    async getFileAsBase64(filePath) {
        return await new Promise((resolve, reject) => {
            fs.readFile(filePath, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    const base64Data = Buffer.from(data).toString('base64');
                    resolve(base64Data);
                }
            });
        });
    }
}


module.exports = FileUploader;