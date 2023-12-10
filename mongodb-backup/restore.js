const { exec } = require('child_process');
const {getInput} = require("./utils");

main();

async function main(){
    console.log("Please provide the MongoDB database URL in the following format:");
    console.log("mongodb+srv://<username>:<password>@<clustername>.mongodb.net");
    const connectionString = await getInput("Enter the database URL: ")
    
    const backupPath = await getInput("Please provide the backup folder: ")

    const command = `mongorestore --uri="${connectionString}" ${backupPath}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Data restored successfully. Output: ${stdout}`);
    });
}