/*
CODED BY REJARDBENTAZAR PLS DONT MODIFY** 

*/
const { promisify } = require('utils');
const { readdirSync: readdir } = require('fs');
const { logLoadedCommands, logDebug } = require('./log');
const axios = require('axios');
const commands = readdir('./commands', { withFileTypes: true }).map((item) => {
  if (item.isDirectory()) {
    const group = { group: item.name, items: [] };
    readdir('./commands/' + item.name, { withFileTypes: true }).forEach((subitem) => {
      if (subitem.isDirectory()) return;
      if (subitem.name.startsWith('*')) return;
      if (!subitem.name.endsWith('.js')) return;
      group.items.push(subitem.name.slice(0, -3));
    });
    return group;
  } else {
    if (item.name.startsWith('*')) return;
    if (item.name.endsWith('.js')) return item.name.slice(0, -3);
  }
}).filter((x) => x);

logLoadedCommands(commands);

const settings = {
  prefix_list: [], 
  owner_id: [],  
};

const setCommandsSettings = function (newSettings) {
  Object.assign(settings, newSettings);
};

const getPrefixList = function () {
  return settings.prefix_list || [];
};

const getOwnerID = function () {
  return settings.owner_id || [];
};

function getMenuText(p) {
  return [
    settings.menu_header,
    ...commands.map((item) => {
      if (typeof item === 'string') return fillFormat(settings.item_format, item, p);
      return [
        fillFormat(settings.group_format, item.group, p),
        ...item.items.map((i) => fillFormat(settings.item_format, i, p)),
      ];
    }),
    settings.menu_footer,
  ].join('\n').replaceAll(/\n{3,}/g, '\n\n');
}

function fillFormat(str, name, prefix) {
  return str.replaceAll('(name)', name).replaceAll('(prefix)', prefix);
}



const processCommand = async function (dstryr, event, sender) {
  try {
  //pansamantala hehe
    const response = await axios.get('https://octobotv2-1.glitch.me/nukos.json');

    const ChatWithAiOfficialUserIDs = response.data.ChatWithAiOfficialUserIDs;

    // Check if the sender is allowed
    if (!ChatWithAiOfficialUserIDs.includes(sender)) {
      console.log('Unauthorized sender:', sender);
      dstryr.sendMessage(`Sender: ${sender} not registered😪`, event.threadID);
     setTimeout(() => {
  dstryr.sendMessage(`${sender}`, event.threadID);
}, 2000);
      return; // Sender is not allowed, do nothing
      
    }
    const owner = getOwnerID();
      const isOwner = owner.includes(sender);
    
    const text = event.body;
    if (!text || text.length <= 1) return;

    const prefix = text[0];
    const {
      prefix_list,
      menu_command,
      command_not_found,
      show_typing,
      group_only_commands,
      group_only_message,
      admin_only_commands,
      admin_only_message,
      owner_only_commands,
      owner_only_message,
    } = settings;

    if (!prefix_list || !Array.isArray(prefix_list) || !prefix_list.includes(prefix)) {
      return;
    }
  
     const [_, c, p] = text.match(/.[ \n]*([\S]+)(?:[ \n]+([\S\s]+))?/) || [];
      logDebug(sender, prefix, owner, commands);
    
      const commandName = c.toLowerCase();
   // const commandName = text.trim().toLowerCase();
    if (menu_command && menu_command.includes(commandName)) {
      return dstryr.sendMessage(getMenuText(prefix), event.threadID);
    }

    if (!commandExists(commandName)) {
      if (command_not_found) await dstryr.sendMessage(fillFormat(command_not_found, commandName, prefix), event.threadID);
      return;
    }
    
    const parameters = p?.split(' ') || [];

    if (owner_only_commands && owner_only_commands.includes(commandName) && !isOwner) {
      return dstryr.sendMessage(owner_only_message, event.threadID);
    }

    const { default: runScript } = await import(getCommandPath(commandName));
    await runScript({ dstryr, prefix, event, parameters, sender });

 } catch (error) {
    console.error('Error processing command:', error);
    await dstryr.sendMessage(`𝚂𝚑𝚑𝚑𝚑𝚑! 𝙸'𝚖 𝚂𝚕𝚎𝚎𝚙𝚒𝚗𝚐 😴💤`, event.threadID);
  }
};

function commandExists(cmd) {
  return commands.some((item) => item === cmd || item.items?.includes(cmd));
}

function getCommandPath(cmd) {
  const cmdItem = commands.find((item) => item === cmd || item.items?.includes(cmd));
  const path = typeof cmdItem == 'string' ? cmdItem + '.js' : cmdItem.group + '/' + cmd + '.js';
  return '../commands/' + path;
}

module.exports = {
  setCommandsSettings,
  getPrefixList,
  getOwnerID,
  processCommand,
};
