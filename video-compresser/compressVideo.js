//create multiple qualities for a video
const prompt = require('prompt-sync')();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

//importing ffprobe for getting total number of frames (for percentage progress)
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');


main();


function main(){
    var args = process.argv.slice(2);
    if (args.length === 0){
        console.log("usage:"+ "\x1b[33m" + " npm start 'video_path'" + "\x1b[0m");
    }
    
    args.forEach( async (val, index, array)=>{
        //pick an option
        let option = getOption();
        if (option == undefined){
            throw "Exit";
        }

        //get the total frames in the video
        let filename = val;
        let path = filePath(filename);
        ffprobe(filename, { path: ffprobeStatic.path }, function (err, info) {
            if (err){
                console.error(err);
                throw err;
            } 
            let totalFrames = info.streams[0]["nb_frames"];
            //start compressing
            let basename = baseName(filename);
            console.log("\x1b[32m" + 'Start compressing the video ' + filename + "\x1b[0m");
    
            compressAndChangeSize(filename,basename,option,totalFrames,path)
        });
    });
}

function baseName(str) {
    let base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1) {
        base = base.substring(0, base.lastIndexOf("."));
    }
    return base;
}
function filePath(str){
    let path = new String(str).substring(0,str.lastIndexOf('/')+1);
    return path;
}

function compressAndChangeSize(filename,basename,option,totalFrames,path){
    let trackProgress;
    let command = ffmpeg(filename)
    if (option === 1){
        command.fps(30)
        .addOptions(["-crf 28"])
        .output(path + basename + '-compress-1280x720.mp4')
        .videoCodec('libx265')  
        .size('1280x720');
    }
    if (option === 2){
        command.fps(30)
        .addOptions(["-crf 28"])
        .output(path + basename + '-compress-640x360.mp4')
        .videoCodec('libx265')
        .size('640x360');
    }
    if (option === 3){
        command.fps(30)
        .addOptions(["-crf 28"])
        .output(path + basename + '-compress-256x144.mp4')
        .videoCodec('libx265')
        .size('256x144');
    }

    command.on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })  
        .on('progress', function(progress) {
            let progressPercentage = Math.floor(progress.frames * 100 / totalFrames);
            if (trackProgress !== progressPercentage){
                trackProgress = progressPercentage;
                console.log("\x1b[33m" + `progress: ${progressPercentage}%` + "\x1b[0m");
            }
        })
        .on('end', function() { 
            console.log("\x1b[32m" + 'Finished processing' + "\x1b[0m"); 
        })
        .run();
}

function getOption(){
    while (true){
        console.log(`1: video quality 1280x720\n2: video quality 640x360\n3: video quality 256x144`);
        const option = prompt("pick an option: ");
        let inputNumber = parseInt(option);
        if (!isNaN(inputNumber) && inputNumber <= 3 && inputNumber >=1){
            return inputNumber;
        }else{
            if (option == undefined){
                console.log("\x1b[31m" + "Exit..." + "\x1b[0m");
                process.exit();
            }
            console.log("\x1b[31m" +"wrong choice..." +"\x1b[0m");
        }
    }
}