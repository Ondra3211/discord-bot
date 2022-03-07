
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const playdl = require('play-dl')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Prehraje pisnicku')
    .addStringOption(option => option.setName('song').setDescription('Nazev pisnicky').setRequired(true)),
    async execute(inter) {  
        await inter.deferReply();
        
        const channel = inter.member.voice?.channel;
        if (!channel) return inter.followUp(':x: Musíš být v místnosti!');
    
        const song = await playdl.search(inter.options.getString('song'), { limit: 1 });
        if (!song) return inter.followUp(':x: Nenalezeno');

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
        }

    }
};
