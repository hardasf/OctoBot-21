const { setCommandsSettings } = require('./system/main');

setCommandsSettings({
  prefix_list: ['*','-'],
  owner_id: ["100012874754515",
             "100092157610613"],
  menu_command: ['menu', 'help','about'],
  menu_header: 'ChatWithAiOfficial🤖\nThis Bot is made with Love😘 And aims is to create something wierd that helps ppl on thier studies and many more and i love you🤣\nCommand List:',
  item_format: '\n🗨 (prefix)(name)',
  group_format: '\n📂(name)',
  menu_footer: '\nWebsite: https://octobotv2.onrender.com',
  show_typing: true,
  command_not_found: 'Command (prefix)(name) not found',
  group_only_commands: [], 
  group_only_message: 'That command is for groups only',
  admin_only_commands: [],
  admin_only_message: 'That command is for admin/owner only',
  owner_only_commands: ["shell","restart","octo"],
  owner_only_message: "That command is for owner only",
});
