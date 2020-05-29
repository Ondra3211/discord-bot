const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const time = require('./../utils/time.js');

module.exports = {
	name: 'play',
    description: 'Přehraje skladbu',
    voice: true,
	async execute(msg, args) {

        if (!args[0]) return msg.client.commands.get('resume').execute(msg, args);

        const play = song => {

            const queue = msg.client.queue.get(msg.guild.id);

            const dispatcher = queue.connection.play(ytdl(song.url, { filter: 'audioonly' }), { volume: queue.volume });

            dispatcher.on('start', () => {
                queue.playing = true;
                msg.channel.send(`:notes: **Přehrávám** \`${song.title}\``);
            });

            dispatcher.on('finish', () => {
                queue.songs.shift();
                queue.playing = false;

                if (!queue.songs[0]) {
                    queue.voice.leave();
                    msg.client.queue.delete(msg.guild.id);
                } else {
                    play(queue.songs[0]);
                }
            });
        }

        const argument = args.join(' ');

        const serverQueue = msg.client.queue.get(msg.guild.id) || {
            voice: msg.member.voice.channel,
            connection: null,
            volume: 0.5,
            songs: [],
            playing: false,
        };


        let items;

        if (ytdl.validateURL(argument)) {
        
            const info = await ytdl.getInfo(argument);

            items = [ info ];

        } else if (ytpl.validateURL(argument)) {

            const info = await ytpl(argument, { limit: 30 });

            items = info.items;

        } else {

            const info = await ytsr(argument, { limit: 1 });

            items = info.items;

        }

        for (let i = 0; i < items.length; i++) {

            if (i === 1 ) msg.channel.send(':hourglass: Pracuji na tom...');

            const info = items[i];

            const song = {
                url: info.video_url || info.url_simple || info.link,
                title: info.title,
                id: info.video_id || info.id || ytdl.getURLVideoID(info.link),
                seconds: info.length_seconds || time.strToSec(info.duration),
            }

            console.log(song);

            if (song.seconds > (3 * 60 * 60)) {
                msg.channel.send(':x: Nelze přehrát video delší něž 3 hodiny');
                continue;
            }

            serverQueue.songs.push(song);
        }

        if (serverQueue.playing) return msg.channel.send(`:arrow_up: Přídáno do fronty \`${serverQueue.songs[serverQueue.songs.length - 1].title}\``);

        serverQueue.connection = await msg.member.voice.channel.join();

        msg.client.queue.set(msg.guild.id, serverQueue);

        play(serverQueue.songs[0]);
	}
};