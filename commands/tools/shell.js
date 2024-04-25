const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async function ({ dstryr, event, parameters }) {
  try {
    const command = parameters.join(' '); // Join the parameters into a single string
    const { stdout, stderr } = await exec(command);

    if (stdout) {
      dstryr.sendMessage(`Command output:\n${stdout}`, event.threadID);
    } else if (stderr) {
      dstryr.sendMessage(`Error executing command:\n${stderr}`, event.threadID);
    } else {
      dstryr.sendMessage('Command executed successfully.', event.threadID);
    }
  } catch (error) {
    console.error(error);
    dstryr.sendMessage('An error occurred while processing your request.', event.threadID);
  }
};