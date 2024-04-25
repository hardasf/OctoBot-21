const axios = require('axios');

module.exports = async function ({ dstryr, event, parameters }) {
  try {
  if (parameters.length === 0) {
            dstryr.sendMessage('ano i sesearch ko lugaw?', event.threadID);
            return;
        }
        
    const apiUrl = 'https://api.kenliejugarap.com/ai/?text=' + encodeURIComponent(parameters.join(' '));

    
    const response = await axios.get(apiUrl);

    
    const apiResponse = response.data.response;

    
    dstryr.sendMessage(apiResponse, event.threadID);
  } catch (error) {
    console.error(error);
    dstryr.sendMessage('Error🙄', event.threadID);
  }
};
