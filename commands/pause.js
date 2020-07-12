module.exports = {
    name: 'pause',
    aliases: ['stop'],
	description: 'Pozastaví přehrávání',
	voice: true,
	async execute(msg, args) {

		const serverQueue = msg.client.queue.get(msg.guild.id);
		
        if (!serverQueue || !serverQueue.playing) {
            msg.channel.send(':x: Nic se nehraje');
            return;
        }

        serverQueue.connection.dispatcher.pause();

        msg.channel.send(':pause_button: Pozastaveno');
	}
};
