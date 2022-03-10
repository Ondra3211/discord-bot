
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Prehraje pisnicku')
    .addStringOption(option => option.setName('song').setDescription('Nazev pisnicky').setRequired(true)),
    async execute(inter) {  
        const channel = inter.member.voice?.channel;
        if (!channel) return inter.reply({ content: ':x: Musíš být v místnosti!', ephemeral: true });
    
        const queue = inter.client.player.createQueue(inter.guild, {
            metadata: {
                inter: inter
            }
        });
        queue.metadata.inter = inter;

        try {
            if (!queue.connection) await queue.connect(inter.member.voice.channel);
        } catch {
            queue.destroy();
            return await inter.reply({ content: ':x: Nepodařilo se připojit do místnosti!', ephemeral: true });
        }

        await inter.deferReply();
        const song = (await inter.client.player.search(inter.options.getString('song'), {})).tracks[0];
        if (!song) return await interaction.followUp({ content: ':x: Nepodařilo se přehrát skladbu.', ephemeral: true });

        await queue.play(song);
        queue.skip();
        queue.setVolume(50);
    }
};
