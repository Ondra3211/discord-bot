const fs = require('fs');
const { Client, Collection } = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Client();

client.commands = new Collection();
client.games = new Collection();
client.queue = new Map();
client.settings = require('./guilds.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        console.log(`[INFO] Načítám ${file}`);
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    } catch (error) {
        console.log(`[INFO] Chyba při načítání ${file}`);
    }
}



client.once('ready', async () => {
    console.log(`[INFO] Připojen za ${client.user.tag}`);

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
    if (!msg.guild || msg.author.bot) return;

    const guildPrefix = client.settings[msg.guild.id] && client.settings[msg.guild.id].prefix || prefix;

    if (!msg.content.startsWith(guildPrefix)) return;

    const args = msg.content.slice(guildPrefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const queue = msg.client.queue.get(msg.guild.id);

    const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));

    if (!command) return;

    if (command.voice) {
        if (!msg.member.voice.channel || (queue && msg.member.voice.channel.id !== queue.voice.id)) return msg.channel.send(':x: Musíš být ve voice channelu');
    }

    if (command.permission) {
        if (!msg.member.hasPermission(command.permission)) return command.permission_message ? msg.channel.send(command.permission_message) : msg.channel.send(':x: Nedostatečná oprávnění');
    }


    command.execute(msg, args).catch(err => {
        console.log(`[INFO] Příkaz ${command.name}.js se nepovedlo vykonat`);
        console.log(err);
    });
});

client.login(token);