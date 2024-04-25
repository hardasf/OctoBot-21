const axios = require('axios');

const API_URL = 'https://api.popcat.xyz/joke';

module.exports = async function ({ dstryr, event, parameters }) {
    try {
        
        const apiUrl = `${API_URL}${encodeURIComponent(parameters.join(' '))}`;
        const response = await axios.get(apiUrl);
        const apiResponse = response.data.joke;

        dstryr.sendMessage(apiResponse, event.threadID);
    } catch (error) {
        console.error('Error:', error.message);
        dstryr.sendMessage('An error occurred while processing your request.', event.threadID);
    }
};