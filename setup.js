const { Routes, REST } = require("discord.js");
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const commands = [
  { name: 'join', description: 'Join voice chat!' },
  { name: 'leave', description: 'Leave voice chat!' },
];

try {
  console.log('Started refreshing application (/) commands.');
  rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}