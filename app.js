const express = require('express');
const app = express();
const fs = require('fs').promises; 

app.all('*', async (req, res) => {
    //Variables to identify file and extension type of the request path.
    const rp = req.path;
    const lastPeriod = rp.lastIndexOf('.');
    const rpExt = rp.substring(lastPeriod); 
    let rpFolder  = ''; 

    if(rp === '/') { //if it is the root directory, respond with index.html.
        res.type('html');
        const content = await fs.readFile('./wwwroot/html/index.html') 
        res.send(content); 
    } else { //Otherwise figure out the file path folder type
         if (rpExt === '.html') {
            rpFolder = '/html'  
        } else if (rpExt === '.css') {
            rpFolder = '/css'
        } else if (rpExt === 'ico') {
            rpFolder = '/ico'
        } else if (rpExt ==='.js') { //had to make it intentionally unsecure here and there to access the secret, I get the idea though.
            rpFolder = '/..'
        } else if (rpExt==='.txt') {
            rpFolder = '/../..'
        }
        else { //if it is a image file path
            rpFolder = '/imgs';
        }
        console.log(rp);

        res.type(rpExt);
        const path = `./wwwroot${rpFolder}/${rp.substring(rp.lastIndexOf('/')+1)}`; 
        try {
            const content = await fs.readFile(path);
            res.send(content);
        } catch (error) {
            res.status(404).send('File not found');
        }
    }
});

app.listen(3000, 'localhost', () => {
    console.log('Example app listening at http://localhost:3000');
  });