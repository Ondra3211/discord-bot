
const { SlashCommandBuilder } = require('@discordjs/builders');
const { RequestManager } = require('@discordjs/rest');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, entersState, NoSubscriberBehavior, VoiceConnectionStatus, AudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
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
        if (!channel) return inter.editReply(':x: Musíš být v místnosti!');

        let song = inter.options.getString('song');
    
        if (!ytdl.validateURL(inter.options.getString('song'))) {
            song = await ytsr(inter.options.getString('song'), { limit: 1 });
            song = song.items[0]?.url
        }

        if (!song) return inter.editReply(':x: Nenalezeno');

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready);

        const player = createAudioPlayer();
        player.on('error', error => {
            connection.destroy();
            return inter.editReply(':x: Nenalezeno');
        });
        player.on(AudioPlayerStatus.Playing, () => {
            inter.editReply(':white_check_mark: Prehravam');
        });


        const resource = createAudioResource(ytdl(song), { filter: 'audioonly' });
        player.play(resource);
        connection.subscribe(player);
    }
};
