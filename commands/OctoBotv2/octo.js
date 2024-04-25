const axios = require('axios');

module.exports = async function ({ dstryr, event, parameters }) {
  try {
    // Check if parameters are empty
    if (parameters.length !== 2) {
      dstryr.sendMessage('Invalid parameters. Please provide an action (add/delete) and a UID (number).', event.threadID);
      return; // Exit the function early
    }

    const [action, uid] = parameters;

    // Check if the action is valid (add/delete)
    if (action !== 'add' && action !== 'delete') {
      dstryr.sendMessage('Invalid action. Please use "add" or "delete".', event.threadID);
      return; // Exit the function early
    }

    // Check if UID is a valid number
    if (isNaN(uid)) {
      dstryr.sendMessage('Invalid UID. Please provide a valid number.', event.threadID);
      return; // Exit the function early
    }

    // Construct the URL with the provided action and UID
    const apiUrl = `https://nukos.onrender.com/manage-uids?action=${action}&uid=${uid}`;

    // Make a request to the API URL
    const response = await axios.get(apiUrl);

    // Check the response and send a corresponding message
    if (response.data.message) {
      dstryr.sendMessage(response.data.message, event.threadID);
    } else {
      dstryr.sendMessage('Error while processing the request. Please try again.', event.threadID);
    }
  } catch (error) {
    console.error(error);
    dstryr.sendMessage('Error🙄', event.threadID);
  }
};