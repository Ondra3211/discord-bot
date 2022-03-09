
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Prehraje pisnicku')
    .addStringOption(option => option.setName('song').setDescription('Nazev pisnicky').setRequired(true)),
    async execute(inter) {  
        await inter.deferReply();
        
        const channel = inter.member.voice?.channel;
        if (!channel) return inter.followUp({ content: ':x: Musíš být v místnosti!', ephemeral: true });
    
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
            return await interaction.reply({ content: "Nepodařilo se připojit do místnosti!", ephemeral: true });
        }


        const song = (await inter.client.player.search(inter.options.getString('song'), {})).tracks[0];
        if (!song) return await interaction.followUp({ content: ':x: Nepodařilo se přehrát skladbu.', ephemeral: true });

        await queue.play(song);
        queue.skip();
        queue.setVolume(50);


     /*   const song = await playdl.search(inter.options.getString('song'), { limit: 1 });
        if (!song[0]) return await inter.followUp(':x: Nenalezeno');

        const stream = await playdl.stream(song[0].url);

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

            const player = createAudioPlayer();
            const resource = createAudioResource(stream.stream, { inputType: stream.type  });
            player.play(resource);
            connection.subscribe(player);

            await entersState(player, AudioPlayerStatus.Playing, 10_000);
            
            inter.followUp(`:notes: Přehrávám **${song[0].title}**`);
        } catch(error) {
            inter.followUp(`:x: Nepodařilo se přehrát skladbu.`)
            console.error(error);
        }*/

    }
};
