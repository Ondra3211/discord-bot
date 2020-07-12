module.exports = {
	name: 'shuffle',
    description: 'Informace o přehrávané skladbě',
    voice: true,
	async execute(msg, args) {

        const shuffle = array => {

            for (let i = (array.length - 1); i > 0; i--) {
                
                const random = Math.floor(Math.random() * i);

                const temp = array[i];
                array[i] = array[random];
                array[random] = temp;
                
            }

            return array;
        }

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) return msg.channel.send(':x: Nic se nehraje');
        if (!(serverQueue.songs.length > 1)) return msg.channel.send(':x: Fronta je prázdná');

        serverQueue.songs = shuffle(serverQueue.songs);

        msg.channel.send(':twisted_rightwards_arrows: Fronta byla zamíchána');

	}
};
