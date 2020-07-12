module.exports = {
    name: 'queueloop',
    aliases: ['repeatqueue', 'queuerepeat'],
    description: 'Opakovaní fronty',
    voice: true,
	async execute(msg, args) {

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) return msg.channel.send(':x: Nic se nehraje');

        const loop = serverQueue.queueloop;

        if (loop.enabled) {
            loop.enabled = false;
            msg.channel.send(':repeat: Opakování fronty vypnuto');
            return;
        }

        loop.enabled = true;
        msg.channel.send(':repeat: Opakování fronty zapnuto')
	}
};
