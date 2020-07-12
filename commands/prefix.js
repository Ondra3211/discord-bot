const { prefix } = require('./../config.json');
const fs = require('fs');

module.exports = {
    name: 'prefix',
    aliases: ['setprefix'],
    permission: ['MANAGE_GUILD'],
    description: 'Změní prefix na serveru',
	async execute(msg, args) {

        const defaultSettings = {
            prefix: prefix,
        }

        const guildSettings = msg.client.settings[msg.guild.id] || defaultSettings;

        if (!args.length) return msg.channel.send(`Prefix je nastaven na: \`${guildSettings.prefix}\``);

        guildSettings.prefix = args[0];
        msg.client.settings[msg.guild.id] = guildSettings;

        const data = JSON.stringify(msg.client.settings);

        fs.writeFileSync('./guilds.json', data);

        msg.channel.send(`Prefix byl změněn na \`${args[0]}\``);
	}
};
