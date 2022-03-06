
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Zastavi prehravani'),
    async execute(inter) {
        const connection = getVoiceConnection(inter.guild.id);
        connection.destroy();

        inter.reply(':white_check_mark: Zastaveno')
    }
};
