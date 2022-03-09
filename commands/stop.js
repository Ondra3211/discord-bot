
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Zastavi prehravani'),
    async execute(inter) {
        await inter.client.player.deleteQueue(inter.guild);

        inter.reply(':white_check_mark: Zastaveno')
    }
};
