const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('web')
    .setDescription('Vytvoří web')
    .addStringOption(option => option.setName('username').setDescription('Název uživatele').setRequired(true)),
    async execute(inter) {

        const username = inter.options.getString('username');
        const usernameEncoded = encodeURI(username);

        try {
            const res = await fetch(`http://127.0.0.1:3002/create?username=${username}`);
            const data = await res.json();

            const reply = `
FTP Hostitel: zerocz.eu
FTP Uživatel: \`${data[0]['ftp_username']}\`
FTP Heslo: \`${data[0]['ftp_password']}\`
MySQL Administrace: https://db.zerocz.eu
MySQL Uživatel: \`${data[1]['db_username']}\`
MySQL Heslo: \`${data[1]['db_password']}\`
Web: http://${data[0]['ftp_username']}.bagetak.fun`;

            inter.reply({ content: reply, ephemeral: true });
            
        } catch (err) {
            console.log(err);
            inter.reply({ content: ':x: Nastala chyba pri získávání informací', ephemeral: true });
        }

    }
};
