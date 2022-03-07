const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Znovu nacte prikazy')
    .addStringOption(option => option.setName('prikaz').setDescription('Prikaz k obnoveni').setRequired(true)),
    permission: ['ADMINISTRATOR'],
    async execute(inter) {

        if (inter.member.id != '319537484734398466') return;

        const toReload = [];

        const commandName = inter.options.getString('prikaz', true).toLowerCase();

        if (commandName == 'all') {
            inter.client.commands.each(cmd => toReload.push(cmd));
        } else if (!inter.client.commands.get(commandName)) {
            return inter.reply(`:x: Příkaz ${commandName} neexistuje`);
        } else {
            toReload.push(inter.client.commands.get(commandName));
        }

        if (toReload.length < 1) {
            return inter.reply(`:x: Příkaz \`${args[0]}\` neexistuje`);
        }

        let message = '';

        for (let i = 0; i < toReload.length; i++) {

            delete require.cache[require.resolve(`./${toReload[i].data.name}.js`)];

            try {
                const reload = require(`./${toReload[i].data.name}.js`);
                inter.client.commands.set(reload.data.name, reload);

                message += `:white_check_mark: - **${toReload[i].data.name}**\n`;

                console.log(`[INFO] Načítám ${toReload[i].data.name}.js`);

            } catch (error) {
                message += `:x: - **${toReload[i].data.name}**\n`;
                console.log(`Příkaz ${toReload[i].data.name}.js se nepovedlo načíst`);
                console.error(error);
            }

        }

        const embed = new MessageEmbed()
            .setTitle('**Načítání příkazů**')
            .setColor('#5cb85c')
            .setDescription(message);

        inter.reply({ embeds: [embed], ephemeral: true });

    }
};