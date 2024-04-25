const fs = require('fs').promises;
const path = require('path');

module.exports = async function ({ dstryr, event }) {
  try {
    const fileName = '../../data.json';
    const filePath = path.resolve(__dirname, fileName); // Assuming the file is in the same directory as this script

    // Check if the file exists
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const userData = JSON.parse(fileContent);

      const userIDsList = userData.ChatWithAiOfficialUserIDs.join(', ');

      if (userIDsList) {
        dstryr.sendMessage(`List of Banned User IDs:\n${userIDsList}`, event.threadID);
      } else {
        dstryr.sendMessage('No user IDs found in the list.', event.threadID);
      }
    } else {
      dstryr.sendMessage('Nukos.json file not found.', event.threadID);
    }
  } catch (error) {
    console.error(error);
    dstryr.sendMessage('Sorry, an error occurred while processing your request. 🥺', event.threadID);
  }
};
