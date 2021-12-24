const { exec } = require('child_process');
const fs = require('fs');
const fspromises = require('fs').promises
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());

app.post('/api/compile', async(req, res) => {
    let fileName = `test.${getFileExtension(req.body.language)}`;
    await writeFile(fileName, req.body.code);
    let result = await compile(fileName, req.body.language);    
    res.json(result);
    
});
app.listen(3001);
function getFileExtension(language) {
    if(language == 'clike')
        return "c";
}
async function writeFile(fileName, data) {
    try {
        await fspromises.writeFile(fileName, data);
        console.log("written successfully");
    } catch(error) {
        console.log(error);
    }
}

function readFile(filePath) {
    fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
        if(err) {
            console.log(err);
            return;
        }
    });
}

function getCommand(fileName, language) {
    if(language == 'clike')
        return `g++ ${fileName} -o output.out`;
}
function compile(fileName, language) {
    let command = getCommand(fileName, language);
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if(error) { 
                console.log(error);
                resolve({err: stderr});
            }
            resolve({transpiledCode: 'some js code'});
         });
    });
    
}
