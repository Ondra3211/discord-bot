const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'queue',
    description: 'Zobrazí sklady ve frontě',
    voice: true,
	async execute(msg, args) {
        
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) {
            msg.channel.send(':x: Nic se nehraje');
            return;
        }

        if (!serverQueue.songs[1]) {
            msg.channel.send(':x: Fronta je prázdná')
            return;
        }

        const songs = serverQueue.songs;
        const page = args[0] || 1;
        const minPage = 1;
        const maxPage = (Math.floor((songs.length - 2) / 10) + 1);

        if (page > maxPage || page < minPage) return msg.channel.send(':x: Tato stránka neexistuje');

        let message = '';

        for (let i = ((page * 10) - 9); i < songs.length; i++) {
            if (i > (10 * page)) break;

            message += `**${i}**. [${songs[i].title}](${songs[i].url})\n`;
        }

        const embed = new MessageEmbed()
        .setTitle('**Fronta**')
        .setColor('#5cb85c')
        .setAuthor('SlimeBall', 'https://i.zerocz.eu/ja/7dQuXUidrC.png')
        .setDescription(message)
        .setThumbnail(`https://i.ytimg.com/vi/${songs[1].id}/hqdefault.jpg`)
        .setFooter(`Stránka ${page}/${maxPage}`)

        msg.channel.send(embed);
    }
};