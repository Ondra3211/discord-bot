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
        if (msg.member.voice.selfDeaf) return msg.channel.send(':x: Nesmíš mít ztlumené zvuky');

        const play = song => {

            const queue = msg.client.queue.get(msg.guild.id);

            const dispatcher = queue.connection.play(ytdl(song.url, { filter: 'audioonly' }), { volume: queue.volume });

            dispatcher.on('start', () => {
                queue.playing = true;
            });

            dispatcher.on('finish', () => {
                queue.playing = false;

                if (queue.voice.members.size === 1) queue.songs = [];

                //loop
                if (queue.loop.enabled) {
                    (!queue.loop.infinity && queue.loop.count > 1) ? queue.loop.count-- : queue.loop.enabled = false;
                } else if (queue.queueloop.enabled) {
                    queue.songs.push(queue.songs.shift());
                } else {
                    queue.songs.shift();
                }

                if (!queue.songs[0]) {
                    queue.voice.leave();
                    msg.client.queue.delete(msg.guild.id);
                } else {
                    play(queue.songs[0]);
                }
            });

            dispatcher.on('error', () => {
                play(queue.songs[0]);
               console.log('Přehrávání bylo přerušeno z nečekaného důvodu...');
            });
        }

        const argument = args.join(' ');

        const serverQueue = msg.client.queue.get(msg.guild.id) || {
            voice: msg.member.voice.channel,
            connection: null,
            volume: 0.5,
            songs: [],
            loop: { enabled: false, infinity: false, count: 0 },
            queueloop: { enabled: false },
            playing: false,
        };

        let items;

        try {

            if (ytdl.validateURL(argument)) {
            
                const info = await ytdl.getInfo(argument);

                items = [ info ];

            } else if (ytpl.validateURL(argument)) {

                const info = await ytpl(argument, { limit: 500 });

                items = info.items;

            } else {

                const info = await ytsr(argument, { limit: 1 });

                items = info.items;

            }
        } catch (err) {
            return msg.channel.send(':x: Nastala chyba při hledání');
        }

        for (let i = 0; i < items.length; i++) {

            const info = items[i];

            if (info.author.name === null) continue;

            const song = {
                url: info.video_url || info.url_simple || info.link,
                title: info.title,
                id: info.video_id || info.id || ytdl.getURLVideoID(info.link),
                seconds: info.length_seconds || time.strToSec(info.duration),
            }

            if (items.length === 1 && song.seconds > (3 * 60 * 60)) {
                msg.channel.send(':x: Nelze přehrát video delší něž 3 hodiny');
                continue;
            }

            serverQueue.songs.push(song);
        }

        // ${argument} pak předělat na pěkny link na playlist

        if (serverQueue.playing && items.length > 1) return msg.channel.send(`:arrow_up: Přidáno do fronty \`${items.length}\` skladeb z playlistu ${argument}`);
        if (serverQueue.playing) return msg.channel.send(`:arrow_up: Přídáno do fronty \`${serverQueue.songs[serverQueue.songs.length - 1].title}\``);
        
        if (items.length > 1) msg.channel.send(`:notes: Přehrávám \`${items.length}\` skladeb z playlistu \`${argument}\``);

        msg.channel.send(`:notes: **Přehrávám** \`${items[0].title}\``);

        serverQueue.connection = await msg.member.voice.channel.join();
        msg.client.queue.set(msg.guild.id, serverQueue);
        play(serverQueue.songs[0]);
	}
};