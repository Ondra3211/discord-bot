module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'Opakovaní skladby',
    voice: true,
    async execute(msg, args) {

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue || !serverQueue.playing) return msg.channel.send(':x: Nic se nehraje');

        const loop = serverQueue.loop;

        if (loop.enabled) {
            loop.enabled = false;
            msg.channel.send(':repeat: Opakování vypnuto');
            return;
        }

        loop.enabled = true;

        if (!args[0] || isNaN(args[0])) {
            loop.infinity = true;
            msg.channel.send(':repeat: Opakování zapnuto');
        } else {
            loop.count = args[0];
            msg.channel.send(`:repeat: Opakování zapnuto na ${args[0]}krát`);
        }
    }
};
