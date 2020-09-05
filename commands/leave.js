module.exports = {
    name: 'leave',
    description: 'Opustí voice channel',
    voice: true,
    async execute(msg, args) {

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) return;

        serverQueue.voice.leave();
        msg.client.queue.delete(msg.guild.id);
        msg.channel.send(':wave: Odcházím...');



    }
};