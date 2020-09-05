module.exports = {
    name: 'skip',
    description: 'Přeskočí skladbu',
    voice: true,
    async execute(msg, args) {

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) {
            msg.channel.send(':x: Nic se nehraje');
            return;
        }

        if (!serverQueue.songs[0]) {
            msg.channel.send(':x: Nemám kam přeskočit!');
            return;
        }

        if (!args[0]) return serverQueue.connection.dispatcher.end();
        if (isNaN(args[0])) return;

        if (args[0] < 1 || args[0] > serverQueue.songs.length) return msg.channel.send(':x: Nelze přeskočit');

        for (let i = 0; i < (args[0] - 1); i++) {
            serverQueue.songs.shift();
        }

        serverQueue.connection.dispatcher.end();

    }
};