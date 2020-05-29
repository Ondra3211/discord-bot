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

        serverQueue.connection.dispatcher.end();

    }
};