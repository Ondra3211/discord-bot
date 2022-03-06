const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Odezva k API'),
	async execute(inter) {

		const sleep = (ms) => {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		const animation = [
			'Pinging.', 'Pinging..', 'Pinging...', 'Pinging....', 'Pinging.....'
		];

		let message = await inter.reply({ content: animation[0], fetchReply: true });

		const sleepTime = 1500;
		const pings = 5;

		let results = 0;
		let min = 999;
		let max = 0;

		let lastResult;

		let start;

		for (let i = 1; i <= pings; i++) {
			start = Date.now();
			await message.edit(animation[i]);

			lastResult = (Date.now() - start);
			results += lastResult;

			min = Math.min(min, lastResult);
			max = Math.max(max, lastResult);

			await sleep(sleepTime);
		}

		const ping = (results / pings).toFixed();

		await message.edit(`Min: ${min} ms, Prům: ${ping} ms, Max: ${max} ms`);
	}
};