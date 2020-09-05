const { MessageEmbed } = require('discord.js');
const { secToStr } = require('./../utils/time.js');

module.exports = {
    name: 'info',
    description: 'Informace o přehrávané skladbě',
    voice: true,
    async execute(msg, args) {

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) {
            msg.channel.send(':x: Nic se nehraje');
            return;
        }

        const lineLength = 17;

        const song = serverQueue.songs[0];
        const videoTime = Math.round(serverQueue.connection.dispatcher.streamTime / 1000);
        const videoMaxTime = song.seconds;
        const videoPercent = Math.round(videoTime / videoMaxTime * 100);
        const linePercent = Math.round(videoPercent / 100 * lineLength)

        let message = '';

        for (let i = 0; i <= lineLength; i++) {
            if (i === linePercent) {
                message += ':radio_button:';
            } else {
                message += '▬';
            }
        }

        message += ` (${secToStr(videoTime)}/${secToStr(videoMaxTime)})`;


        const embed = new MessageEmbed()
            .setTitle('**Nyní hraje**')
            .setColor('#5cb85c')
            .setAuthor('SlimeBall', 'https://i.zerocz.eu/ja/7dQuXUidrC.png')
            .setDescription(`[${song.title}](${song.url})\n${message}`)
            .setThumbnail(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`)

        msg.channel.send(embed);
    }
};
