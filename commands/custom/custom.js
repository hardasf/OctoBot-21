const axios = require('axios');
const fs = require('fs');

module.exports = async function ({ dstryr, event }) {
  try {
    var msg1 = {
      body: "How to Add Custom Commands"
   //   attachment: fs.createReadStream(__dirname + '/rejard.jpg')
    };

    var msg2 = {
      body: "1. See the example of cmds here: https://raw.githubusercontent.com/LeechShares/Shared/main/Sample.js\n2. Go to this Link to upload: https://octobotv2.onrender.com/\n3. Type *refresh🥱 ",
      // Add your second message details here
    };

    // Send the first message
    dstryr.sendMessage(msg1, event.threadID);
//3

    
    // Introduce a delay of 2 seconds before sending the second message
    setTimeout(() => {
      dstryr.sendMessage(msg2, event.threadID);
    }, 2000);

  } catch (error) {
    console.error(error);
    dstryr.sendMessage('An error occurred while processing your request.', event.threadID);
  }
};
