module.exports = {
	name: 'volume',
    description: 'Nastaví hlasitost skladby',
    voice: true,
	async execute(msg, args) {
        
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) {
            msg.channel.send(':x: Nic se nehraje');
            return;
        }

        if (!args[0]) {
            msg.channel.send(`:loud_sound: Aktuální hlasitost: ${serverQueue.connection.dispatcher.volume * 100}%`);
            return;
        }

        if (isNaN(args[0]) || !(args[0] >= 0 && args[0] <= 100)) {
            msg.channel.send(':x: Hlasitost lze nastavit pouze v rozmezí \`0-100\`');
            return;
        }

        const volume = (args[0] / 100);

        serverQueue.connection.dispatcher.setVolume(volume);
        serverQueue.volume = volume;

        msg.channel.send(`:loud_sound: Hlasitost nastavena na ${args[0]}%`);

    }
};






















