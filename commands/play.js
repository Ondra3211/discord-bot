
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core')
const ytsr = require('ytsr');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Prehraje pisnicku')
    .addStringOption(option => option.setName('song').setDescription('Nazev pisnicky').setRequired(true)),
    async execute(inter) {  
        await inter.deferReply();
        
        const channel = inter.member.voice?.channel;
        if (!channel) return inter.followUp(':x: Musíš být v místnosti!');
    
        let song = await ytsr(inter.options.getString('song'), { limit: 1 });
        song = song.items[0];

        if (!song) return inter.followUp(':x: Nenalezeno');

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready);

            const player = createAudioPlayer();
            const resource = createAudioResource(ytdl(song.url), { filter: 'audioonly' });
            player.play(resource);
            connection.subscribe(player);

            await entersState(player, AudioPlayerStatus.Playing);
            
            inter.followUp(`:white_check_mark: Přehrávám **${song.title}**`);
        } catch(error) {
            inter.followUp(`:x: Nepodařilo se přehrát skladbu.`)
            console.error(error);
        }

    }
};
