const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Vymaze zadany pocet zprav')
		.addIntegerOption((option) =>
			option
				.setName('pocet')
				.setDescription('Pocet zprav k vymazani')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(99)
		),
	permission: ['MANAGE_MESSAGES'],
	async execute(inter) {
		const count = inter.options.getInteger('pocet', true);

		const messages = await inter.channel.bulkDelete(count, true);
		inter.reply({
			content: `:white_check_mark: Smazáno ${messages.size == 0 ? messages.size + 1 : messages.size} zpráv`,
			ephemeral: true,
		});
	},
};
