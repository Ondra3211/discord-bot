module.exports = {
    name: 'resume',
    description: 'Přehraje pozastavenou skladbu',
    voice: true,
    async execute(msg, args) {

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) {
            msg.channel.send(':x: Nic se nehraje');
            return;
        }

        serverQueue.connection.dispatcher.resume();

        msg.channel.send(':arrow_forward: Přehrávám');
    }
};
