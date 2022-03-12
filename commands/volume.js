const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Nastavení hlasitosti')
		.addIntegerOption((option) =>
			option
				.setName('volume')
				.setDescription('Nastavení stupně hlasisotsi v procentech')
				.setMinValue(0)
				.setMaxValue(100)
				.setRequired(true)
		),
	async execute(inter) {
		const channel = inter.member.voice?.channel;
		if (!channel) return await inter.reply({ content: ':x: Musíš být v místnosti!', ephemeral: true });

		const queue = inter.client.player.getQueue(inter.guild);
		if (!queue) return await inter.reply({ content: ':x: Nic nehraje!', ephemeral: true });

		const volume = inter.options.getInteger('volume', true);

		if (volume < 0 || volume > 100) return await inter.reply({ content: ':x: Pouze 0-100!', ephemeral: true });

		queue.setVolume(volume);
		inter.reply(`:sound: Hlasitost nastavena na ${volume} %`);
	},
};
