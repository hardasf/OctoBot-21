const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports = async function ({ dstryr, event }) {
  try {
    var msg1 = {
      body: "Sending Babes...😘"
    };

    const apiUrl = "https://your-shoti-api.vercel.app/api/v1/get";

    // Make a POST request
    const { data } = await axios.post(apiUrl, {
      apikey: "$shoti-1hkangh72bobl1qvrug",
    });

    // Destructure relevant information from the response data
    const { url: videoUrl, user: { username, nickname } } = data.data;
   
    // Create a writable stream to save the video locally
    const videoStream = fs.createWriteStream(__dirname + '/video.mp4');

    // Download the video using the 'request' library
    await new Promise((resolve, reject) => {
      const rqs = request(encodeURI(videoUrl));
      rqs.pipe(videoStream);

      rqs.on('end', resolve);
      rqs.on('error', reject);
    });

    // Include the local video file as an attachment
    var msg2 = {
      body: `ToktikUser: ${username} (${nickname})`,
      attachment: fs.createReadStream(__dirname + '/video.mp4')
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
