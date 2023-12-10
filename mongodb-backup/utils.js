const readline = require('readline');


async function getInput(question){
    //input interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve)=>{
        rl.question(question, (answer) => {
            resolve(answer)
            rl.close();
        });
    })
}

module.exports = {getInput}