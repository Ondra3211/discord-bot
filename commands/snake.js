const { EmbedBuilder, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class SnakeGame {
	constructor(msg) {
		this.channel = msg;
		this.user = msg.member;
		this.mapSize = 5;
		this.snakeBody = [this.generatePosition()];
		this.generateApple();
		this.newGame();
	}

	async updateMessage(message) {
		const embed = new EmbedBuilder().setTitle('**Snake Game**').setColor('#5cb85c').setDescription(message);

		await this.message.edit({ embeds: [embed] });
	}

	generatePosition() {
		return { x: Math.floor(Math.random() * this.mapSize), y: Math.floor(Math.random() * this.mapSize) };
	}

	generateApple() {
		let newApple;

		while (true) {
			newApple = this.generatePosition();

			let snakeCollison = false;

			for (let i = 0; i < this.snakeBody.length; i++) {
				if (newApple.x == this.snakeBody[i].x && newApple.y == this.snakeBody[i].y) {
					snakeCollison = true;
				}
			}

			if (!snakeCollison) break;
		}

		this.mapApple = newApple;
	}

	async cleanGame() {
		this.collector.stop();
		await this.message.reactions.removeAll();
		this.message.client.games.get(this.message.guild.id).delete(this.user.id);
	}

	win() {
		this.updateMessage(
			':regional_indicator_y::regional_indicator_o::regional_indicator_u:   :regional_indicator_w::regional_indicator_o::regional_indicator_n:'
		);
		this.cleanGame();
	}

	gameOver() {
		this.updateMessage(
			':regional_indicator_g::regional_indicator_a::regional_indicator_m::regional_indicator_e:   :regional_indicator_o::regional_indicator_v::regional_indicator_e::regional_indicator_r:'
		);
		this.cleanGame();
	}

	drawMap() {
		let mapContent = '';

		for (let y = 0; y < this.mapSize; y++) {
			for (let x = 0; x < this.mapSize; x++) {
				let snakeFound = false;

				for (let i = 0; i < this.snakeBody.length; i++) {
					if (this.snakeBody[i].x == x && this.snakeBody[i].y == y) {
						if (i == 0) {
							mapContent += ':frog:';
						} else if (i == this.snakeBody.length - 1) {
							mapContent += ':small_orange_diamond:';
						} else {
							mapContent += ':white_large_square:';
						}
						snakeFound = true;
					}
				}

				if (!snakeFound) {
					if (this.mapApple.x == x && this.mapApple.y == y) {
						mapContent += ':apple:';
					} else {
						mapContent += ':black_large_square:';
					}
				}
			}

			mapContent += '\n';
		}

		return mapContent;
	}

	newGame() {
		const embed = new EmbedBuilder()
			.setTitle('**Snake Game**')
			.setColor('#5cb85c')
			.setDescription(
				':regional_indicator_l::regional_indicator_o::regional_indicator_a::regional_indicator_d::regional_indicator_i::regional_indicator_g:  :regional_indicator_g::regional_indicator_a::regional_indicator_m::regional_indicator_e:\n\n:grey_question: Ovládání pomocí reakce'
			);

		this.channel.reply({ embeds: [embed], fetchReply: true }).then(async (message) => {
			this.message = message;
			let loaded = false;

			this.collector = this.message.createReactionCollector();
			this.collector.on('collect', async (r, user) => {
				if (user.id == this.user.id && loaded == true) {
					this.move(r.emoji.name);
				}

				if (!user.bot) await r.users.remove(user.id);
			});

			await message.react('⬅️');
			await message.react('➡️');
			await message.react('⬆️');
			await message.react('⬇️');
			await message.react('❌');
			loaded = true;

			this.updateMessage(this.drawMap());
		});
	}

	move(emoji) {
		let snakeX = this.snakeBody[0].x;
		let snakeY = this.snakeBody[0].y;

		switch (emoji) {
			case '⬆️':
				snakeY -= 1;
				break;

			case '⬇️':
				snakeY += 1;
				break;

			case '⬅️':
				snakeX -= 1;
				break;

			case '➡️':
				snakeX += 1;
				break;

			case '❌':
				return this.gameOver();

			default:
				return;
		}

		if (snakeX < 0) snakeX = this.mapSize - 1;
		if (snakeX > this.mapSize - 1) snakeX = 0;
		if (snakeY < 0) snakeY = this.mapSize - 1;
		if (snakeY > this.mapSize - 1) snakeY = 0;

		const newHead = {
			x: snakeX,
			y: snakeY,
		};

		this.snakeBody.unshift(newHead);

		// Opraven bug kdy had se mohl otočit, kdy byl 2 kostičky dlouhý
		// https://i.zerocz.eu/ja/v7EOtpZKT1.gif
		const tailCollison = this.snakeBody.length == 3 ? this.snakeBody.length : this.snakeBody.length - 1;

		for (let i = 1; i < tailCollison; i++) {
			if (newHead.x == this.snakeBody[i].x && newHead.y == this.snakeBody[i].y) {
				return this.gameOver();
			}
		}

		if (newHead.x == this.mapApple.x && newHead.y == this.mapApple.y) {
			if (this.snakeBody.length == this.mapSize * this.mapSize) {
				return this.win();
			}
			this.generateApple();
		} else {
			this.snakeBody.pop();
		}

		this.updateMessage(this.drawMap());
	}
}

module.exports = {
	data: new SlashCommandBuilder().setName('snake').setDescription('Snake game'),
	async execute(msg, args) {
		const games =
			msg.client.games.get(msg.guild.id) ||
			msg.client.games.set(msg.guild.id, new Collection()).get(msg.guild.id);

		if (games.get(msg.member.id)) {
			msg.reply(':x: Již máš rozehranou hru!');
		} else {
			games.set(msg.member.id, new SnakeGame(msg));
		}
	},
};
