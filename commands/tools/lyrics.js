const axios = require('axios');

module.exports = async function ({ dstryr, event, parameters }) {
  try {
    if (!parameters.length) {
      dstryr.sendMessage('Please provide a search query for lyrics.', event.threadID);
      return;
    }

    const searchQuery = encodeURIComponent(parameters.join(''));
    const apiUrl = `https://api.popcat.xyz/lyrics?song=${searchQuery}`;

    // Make a request to the provided API link
    const response = await axios.get(apiUrl);

    // Extract information from the API response
    const { title, artist, lyrics } = response.data;

    // Send the information as a message
    dstryr.sendMessage(`*Title:* ${title}\n*Artist:* ${artist}\n\n${lyrics}`, event.threadID);

  } catch (error) {
    console.error(error);
    dstryr.sendMessage('An error occurred while processing your request.', event.threadID);
  }
};