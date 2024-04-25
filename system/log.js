const gradientString = require('gradient-string');

const log = (message) => {
  console.log(gradientString.rainbow(message));
};

const logReceivedMessage = (sender, body) => {
  log(createLogBorder('SYSTEM', `Received message from ${sender}: ${body}`));
};


const logDebug = (prefix, commands, owner) => {
  const currentDate = new Date().toLocaleString(); 
  const logContent = `User ID: ${prefix}, Prefix: ${commands}\nOwner ID: ${owner}`;
  const logMessage = createLogBorder('SYSTEM', `${currentDate}\n${logContent}`);
  log(logMessage);
};

const createLogBorder = (title, message) => {
  const maxLength = Math.max(title.length, ...message.split('\n').map(line => line.length));
  const topBorder = `╔${'═'.repeat(maxLength + 2)}╗`;
  const bottomBorder = `╚${'═'.repeat(maxLength + 2)}╝`;
  const formattedMessage = message.split('\n').map(line => `║ ${line}${' '.repeat(maxLength - line.length + 1)}║`).join('\n');

  return `${topBorder}\n║ ${title}${' '.repeat(maxLength - title.length + 1)}║\n${formattedMessage}\n${bottomBorder}`;
};



const logAppStateFound = () => {
  log('[ SYSTEM ] Found the bot\'s appstate.');
};
//hehe
  log('http://chatwithai-official.zya.me/');
log('╭────────────────────────────────╮')
log('│      ChatWithAiOfficial        │')
log('╰────────────────────────────────╯')
//hehe

  const logLoadedCommands = (commands) => {
    log('Commands Loaded:');
    commands.forEach((cmd, index) => {
        const design = getCommandDesign(index + 1);
        const padding = ' '.repeat(26 - cmd.length);
        log(`${' '.repeat(13)}${design} ${cmd}`);
    });
  };

const getCommandDesign = (index) => {
  const designs = ['»'];
  return designs[index % designs.length];
};


module.exports = {
  log,
  logReceivedMessage,
  logLoadedCommands,
  logAppStateFound,
  logDebug,
};
