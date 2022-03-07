const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.commands = new Collection();
client.games = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        console.log(`[INFO] Načítám ${file}`);
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    } catch (error) {
        console.log(error);
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
	if (!command) return;

    if (command.permission) {
        if (!interaction.member.permissions.has(command.permission)) return interaction.reply({ content: ':x: Nedostatečné oprávnění!',  ephemeral: true });
    }
    await command.execute(interaction).catch(error => {
        interaction.reply({ content: ':x: Něco se nepovedlo :(', ephemeral: true });
        console.error(error);
    });
});

client.login(token);