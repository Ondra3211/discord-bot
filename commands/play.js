const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Prehraje pisnicku')
		.addStringOption((option) => option.setName('song').setDescription('Nazev pisnicky').setRequired(true)),
	async execute(inter) {
		const channel = inter.member.voice?.channel;
                const query = inter.options.getString('song');
		if (!channel) return inter.reply({ content: ':x: Musíš být v místnosti!', ephemeral: true });

		const queue = inter.client.player.createQueue(inter.guild, {
		        ytdlOptions: {
                		filter: 'audioonly',
		                highWaterMark: 1 << 30,
                		dlChunkSize: 0,
            		},
			metadata: {
				channel: inter.channel
			},
			initialVolume: 50,
                        leaveOnEndCooldown: 1000*60,
                        leaveOnEmptyCooldown: 1000*60
		});

	        try {
        	    if (!queue.connection) await queue.connect(inter.member.voice.channel);
	        } catch {
        	    queue.destroy();
	            return await inter.reply({ content: ':x: Nepodařilo se připojit do místnosti!', ephemeral: true });
        	}

	        await inter.deferReply({ ephemeral: true });
        	const track = await inter.client.player.search(query, {
	            requestedBy: inter.user
        	}).then(x => x.tracks[0]);
	        if (!track) return await inter.followUp({ content: `:x: Skladba ${query}! nebyla nalezena.`, ephemeral: true });

        	queue.play(track);

                return await inter.followUp({ content: `Načítám... **${track.title}**!`, ephemeral: true });
	},
};
