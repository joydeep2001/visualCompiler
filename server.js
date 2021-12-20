const { exec } = require('child_process');
const fs = require('fs');
const express = require('express');
const app = express();
app.get('/api/compile', (req, res) => {
    
});


function writeFile(data) {
    fs.writeFile("newfile.txt", data, (err) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log("written successfully");
        fs.unlink("newfile.txt", () => {
            console.log("deleted successfully");
        });
    });
}


fs.readFile("./server.js", {encoding: 'utf-8'}, (err, data) => {
    if(err) {
        console.log(err);
        return;
    }
    writeFile(data);
});

// exec('gcc test.c -o test', (error, stdout, stderr) => {
//     if(error) { 
//         console.log(error);
        
//         console.log(stderr);
//     }
        
//     console.log(stdout);
//  });