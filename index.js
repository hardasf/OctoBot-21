const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const cron = require('node-cron');
const login = require("fb-chat-support");
const axios = require('axios');
const path = require('path');
const { logReceivedMessage, logAppStateFound } = require('./system/log');
require('./commands-settings');
const { getPrefixList, processCommand } = require('./system/main');
/*
REJARDBENTAZAR IS HERE
*/
setInterval(() => {
  process.exit();
}, 30 * 60 * 1000);

const app = express();
const port = process.env.PORT || 3000;
const REPL_HOME = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`.toLowerCase();

app.use(bodyParser.json());
app.use(express.static('public')); 

//restartbutton
app.post('/api/restartBot', (req, res) => {
  const { restartInterval } = req.body;
  if (restartInterval) {
    const timeoutMs = restartInterval * 60 * 1000;
    res.json({ success: true, message: `Bot will restart in ${restartInterval} minutes.` });
    setTimeout(() => {
      process.exit(1);
      //autoRestart(config.autoRestart);
    }, timeoutMs);
  } else {
    res.status(400).json({ success: false, message: 'Invalid request. Provide a restart interval.' });
  }
});

// setup sa upload
const upload = multer({ dest: 'uploads/' });

let data = require('./data.json');

app.get('/api/data', (req, res) => {
  res.json(data);
});

app.get('/api/allData', (req, res) => {
  const allData = {
    data: data
  };
  res.json(allData);
});

app.get('/api/userData', (req, res) => {
  const userData = fs.readFileSync('./data.json', 'utf-8');
  res.send(userData);
});

app.get('/api/cookieData', (req, res) => {
  const cookieData = fs.readFileSync('./cookie.json', 'utf-8');
  res.send(cookieData);
});

app.post('/api/add', (req, res) => {
  const { uid } = req.body;

  if (uid) {
    data.ChatWithAiOfficialUserIDs.push(uid);
    updateJsonFile(data, './data.json');
    res.json({ success: true, message: 'User ID added successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid request. Provide a valid user ID.' });
  }
});

app.post('/api/delete', (req, res) => {
  const { uid } = req.body;

  if (uid) {
    data.ChatWithAiOfficialUserIDs = data.ChatWithAiOfficialUserIDs.filter(id => id !== uid);
    updateJsonFile(data, './data.json');
    res.json({ success: true, message: 'User ID deleted successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid request. Provide a valid user ID.' });
  }
});

// edit 🍪
app.post('/api/upload', upload.single('cookieFile'), (req, res) => {
  const { path: tempFilePath, originalname } = req.file;

  if (originalname && originalname.toLowerCase() === 'cookie.json') {
    const newCookieData = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));
    updateJsonFile(newCookieData, './cookie.json');
    res.json({ success: true, message: 'Cookie data uploaded and replaced successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid file. Please upload a valid cookie.json file.' });
  }
});

function updateJsonFile(jsonData, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
}
//FOR UPLOADING CMDS
//v2.1
app.get('/api/getFiles', (req, res) => {
  const filesDir = path.join(__dirname, 'commands', 'custom');
  const files = fs.readdirSync(filesDir);
  res.json({ files });
});

app.post('/api/uploadFile', upload.single('uploadedFile'), (req, res) => {
  const { path: tempFilePath, originalname } = req.file;
  const destinationPath = path.join(__dirname, 'commands', 'custom', originalname);

  fs.renameSync(tempFilePath, destinationPath);

  res.json({ success: true, message: 'File uploaded successfully.' });
});

app.delete('/api/deleteFile/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'commands', 'custom', fileName);

  try {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting file.' });
  }
});
//END
const dstryrStatePath = path.join(__dirname, './dstryr_state.json');

try {
  const dstryrStateContent = fs.readFileSync(dstryrStatePath, 'utf-8');
  const dstryrState = JSON.parse(dstryrStateContent);
  const appStateUrl = dstryrState.cookieUrl;

  axios.get(appStateUrl)
    .then(response => {
      const appState = response.data;

      login({ appState }, async (err, api) => {
        if (err) {
          console.error('Error in login:', err);
          return;
        }

        logAppStateFound();

        api.listenMqtt(async (err, event) => {
          if (err) {
            console.error('Error in listenMqtt:', err);
            return;
          }

          switch (event.type) {
            case "message":
              const sender = event.senderID;
              const prefix = getPrefixList();

              logReceivedMessage(sender, event.body);

              if (prefix.includes(event.body[0])) {
                await processCommand(api, event, sender).catch(async (e) => {
                  console.error('Error in processCommand:', e);
                  api.sendMessage(`0x0f1: Application error\n0x0f2: ${e}`, event.threadID);
                });
              }
          }
        });
      });
    })
    .catch(error => {
      console.error('Error fetching app state:', error);
    });
} catch (error) {
  console.error('Error reading dstryr_state.json:', error);
}
//listen to port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
//  console.log(`\nDEVELOPED BY: REJARDGWAPO`);
});