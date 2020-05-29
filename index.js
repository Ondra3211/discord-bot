const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.queue = new Map();

console.log('[DEBUG] Nacitam prikazy...');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log(`[INFO] Pripraven! ${client.user.tag}`);

    let activity = 0;

    const changeActivity = () => {
        const activites = [
            { type: 'PLAYING', text: 'písničky' },
            { type: 'PLAYING', text: `na ${client.guilds.cache.size} discordech` },
            { type: 'WATCHING', text: 'zerocz.eu' },
            { type: 'STREAMING', text: `hudbu na ${client.queue.size} serverech` }
        ];

        if (activites.length === activity) activity = 0;

        client.user.setActivity(activites[activity].text, { type: activites[activity].type });

        activity++;
    }

    changeActivity();

    setInterval(() => {
        changeActivity();
    }, 5 * 1000 * 60);

});

client.on('message', msg => {
    if (!msg.guild || !msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const queue = msg.client.queue.get(msg.guild.id);

    const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));

    if (!command) return;

    if (command.voice) {
        if (!msg.member.voice.channel || (queue && msg.member.voice.channel.id !== queue.voice.id)) return msg.channel.send(':x: Musíš být ve voice channelu');
    }

    try {
        client.commands.get(commandName).execute(msg, args);
    } catch (error) {
        console.log('[ERROR]');
        console.error(error);
        //msg.reply('there was an error trying to execute that command!');
    }
});

client.login(token);