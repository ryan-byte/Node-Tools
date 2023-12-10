const { exec } = require('child_process');
const {getInput} = require("./utils");

main();

async function main(){
    console.log("Please provide the MongoDB database URL in the following format:");
    console.log("mongodb+srv://<username>:<password>@<clustername>.mongodb.net/<dbname>");
    const connectionString = await getInput("Enter the database URL: ")
    
    const backupPath = backupFileName();
    const command = `mongodump --uri="${connectionString}" --out=${backupPath}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Backup successful. Output: ${stdout}`);
    });
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