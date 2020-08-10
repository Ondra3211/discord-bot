const { MessageEmbed, Collection } = require('discord.js');

class SnakeGame {
    constructor(msg) {
        this.channel = msg.channel;
        this.user = msg.author;
        this.mapSize = 5;
        this.snakeBody = [this.generatePosition()];
        this.generateApple();
        this.newGame();
    }

    updateMessage(message) {
        const embed = new MessageEmbed()
        .setTitle('**Snake Game**')
        .setColor('#5cb85c')
        .setDescription(message);

        this.message.edit(embed);
    }

    generatePosition() {
        return { x: Math.floor(Math.random() * this.mapSize), y: Math.floor(Math.random() * this.mapSize) }
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

    cleanGame() {
        this.collector.stop();
        this.message.reactions.removeAll();
        this.message.client.games.get(this.message.guild.id).delete(this.user.id);
    }

    win() {
        this.updateMessage(':regional_indicator_y::regional_indicator_o::regional_indicator_u:   :regional_indicator_w::regional_indicator_o::regional_indicator_n:');
        this.cleanGame();
    }

    gameOver() {
        this.updateMessage(':regional_indicator_g::regional_indicator_a::regional_indicator_m::regional_indicator_e:   :regional_indicator_o::regional_indicator_v::regional_indicator_e::regional_indicator_r:');
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

        const embed = new MessageEmbed()
        .setTitle('**Snake Game**')
        .setColor('#5cb85c')
        .setDescription(':regional_indicator_l::regional_indicator_o::regional_indicator_a::regional_indicator_d::regional_indicator_i::regional_indicator_g:  :regional_indicator_g::regional_indicator_a::regional_indicator_m::regional_indicator_e:\n\n:grey_question: Ovládání w,a,s,d nebo pomocí reakce');

        this.channel.send(embed).then(async message => {

            this.message = message;
            let loaded = false;

            this.collector = this.message.createReactionCollector((emoji, user) => !user.bot);
            this.collector.on('collect', async (r, user) => {
                await r.users.remove(user.id);

                if (user.id == this.user.id && loaded == true) {
                    this.move(r.emoji.name);
                }
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
                this.gameOver();
                break;

            default:
                return;
        }

        if (snakeX < 0) snakeX = this.mapSize - 1;
        if (snakeX > this.mapSize - 1) snakeX = 0;
        if (snakeY < 0) snakeY = this.mapSize - 1;
        if (snakeY > this.mapSize - 1) snakeY = 0;

        const newHead = {
            x: snakeX,
            y: snakeY
        };

        let duplicate = false;

        for (let i = 0; i < this.snakeBody.length; i++) {
            if (newHead.x == this.snakeBody[i].x && newHead.y == this.snakeBody[i].y) {
                duplicate = true;
            }
        }

        if (duplicate) {
            return this.gameOver();
        }

        this.snakeBody.unshift(newHead);

        if (newHead.x == this.mapApple.x && newHead.y == this.mapApple.y) {
            if (this.snakeBody.length == (this.mapSize * this.mapSize)) {
                return this.win()
            };
            this.generateApple();
        } else {
            this.snakeBody.pop();
        }

        this.updateMessage(this.drawMap());
    }

}


module.exports = {
    name: 'snake',
    description: 'Změní prefix na serveru',
	async execute(msg, args) {

        const games = msg.client.games.get(msg.guild.id) || msg.client.games.set(msg.guild.id, new Collection()).get(msg.guild.id);

       if (games.get(msg.author.id)) {
            msg.channel.send(':x: Již máš rozehranou hru!');
       } else {
           games.set(msg.author.id, new SnakeGame(msg))
       }

	}
};
