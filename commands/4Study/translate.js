const axios = require('axios');

module.exports = async function ({ dstryr, event, parameters }) {
  try {
    // Check if parameters are empty
    if (parameters.length === 0) {
      dstryr.sendMessage('ano i tatranslate ko lugaw?', event.threadID);
      return; // Exit the function early
    }

    const textToTranslate = parameters.join(' ');
    const apiUrl = 'https://api.popcat.xyz/translate?to=en&text=' + encodeURIComponent(textToTranslate);

    const response = await axios.get(apiUrl);

    const translatedText = response.data.translated;

    // Create a message with original content and its English translation
    const message = `Translate for: ${textToTranslate}\nEnglish: ${translatedText}`;

    dstryr.sendMessage(message, event.threadID);
  } catch (error) {
    console.error(error);
    dstryr.sendMessage('Error🙄', event.threadID);
  }
};
