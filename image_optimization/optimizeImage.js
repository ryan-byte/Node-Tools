const sharp = require('sharp');
const fs = require('fs');

/**
 * 
 * @param {*} inputFile input file path
 * @param {*} outputFileName output file name
 * @returns output file path
 */
async function optimizeImage(inputFile, outputFileName){
    return await new Promise((resolve,reject)=>{
        fs.readFile(inputFile, (err, inputBuffer) => {
            if (err) {
                console.error('Error reading the file:', err);
                reject(err);
            }
        
            // Convert to WebP
            sharp(inputBuffer)
                .toFormat('webp', {quality: 60})
                .toFile(`${outputFileName}.webp`)
                .then(() => {
                    console.log('Image converted to WebP!');
                    resolve(`${outputFileName}.webp`);
                })
                .catch(err => {
                    console.error('Error converting image to WebP:', err);
                    reject(err);
                });
        });
    })
}

/**
 * 
 * @param {*} base64Data the base64 of the image
 * @returns base64 of the new optimized image in `webp` format
 */
async function optimizeImageBase64(base64Data) {
    return new Promise((resolve, reject) => {
        // Convert base64 to a buffer
        const inputBuffer = Buffer.from(base64Data, 'base64');

        // Convert to WebP
        sharp(inputBuffer)
            .toFormat('webp', { quality: 60 })
            .toBuffer()
            .then(outputBuffer => {
                // Convert the optimized image buffer to base64
                const optimizedBase64 = outputBuffer.toString('base64');
                resolve(optimizedBase64);
            })
            .catch(err => {
                console.error('Error optimizing image:', err);
                reject(err);
            });
    });
}



module.exports = {optimizeImage,optimizeImageBase64};