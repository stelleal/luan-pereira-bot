// Import required modules 
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { join } = require("path");
const { createReadStream } = require("fs");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
require('dotenv').config();

let isLuanPereiraOnVoiceChat = false;
let connection = null;

function loopAudio() {
  const nextTimeInSeconds = (Math.random() * 300 + 4) * 1000;
  const playAudio = Math.floor(Math.random() * 8 + 1);

  const audioPlayer = createAudioPlayer();
  const audioToPlay = `./audios/${playAudio}.mp3`
  const resource = createAudioResource(createReadStream(join(__dirname, audioToPlay)));
  connection.subscribe(audioPlayer);
  audioPlayer.play(resource);

  setTimeout(() => {
    if (isLuanPereiraOnVoiceChat && connection) loopAudio();
  }, nextTimeInSeconds);
}

// Create a new Discord client with message intent 
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent]
});

// Bot is ready 
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on(Events.VoiceStateUpdate, (before, after) => {
  if (before.member.user.username === 'Luan Pereira Bot' && !after.channelId) {
    console.log('desconectado!')
    connection = null;
    isLuanPereiraOnVoiceChat = false;
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'join') {
    connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    isLuanPereiraOnVoiceChat = true;
    loopAudio();
  }

  if (interaction.commandName === 'leave') {
    connection.disconnect();
    connection = null;
    isLuanPereiraOnVoiceChat = false;
  }
});

// Log in to Discord using token from .env 
client.login(process.env.DISCORD_TOKEN); 
