const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = async function ({ dstryr, event }) {
  try {
  const response = await axios.get('https://leechshares.github.io/credits.json');
    const jsonData = response.data;
    var msg2 = {
      body: ` ${jsonData.note}\nCredits: ${jsonData.credits.join(', ')}`,
      attachment: fs.createReadStream(path.join(__dirname, '../../rejard/logo.jpg'))
    };

    var msg1 = {
      body: "Showing about Credits💬",
      // Add your second message details here
    };

    // Send the first message
    dstryr.sendMessage(msg1, event.threadID);

    // Introduce a delay of 2 seconds before sending the second message
    setTimeout(() => {
      dstryr.sendMessage(msg2, event.threadID);
    }, 2000);

  } catch (error) {
    console.error(error);
    dstryr.sendMessage('An error occurred while processing your request.', event.threadID);
  }
};
