const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'reload',
	description: '',
	async execute(msg, args) {
        
        if (msg.author.id !== '319537484734398466') return;

        if (!args[0]) {
            msg.channel.send(':x: Musíš zadat název příkazu!');
            return;
        }

        const toReload = [];

        const commandName = args[0].toLowerCase();

        if (commandName == 'all') {
            msg.client.commands.each(cmd => toReload.push(cmd));
        } else {
            toReload.push(msg.client.commands.get(commandName));
        }

        if (toReload.length < 1) {
            return msg.channel.send(`:x: Příkaz \`${args[0]}\` neexistuje`);
        }

        let message = '';

        for (let i = 0; i < toReload.length; i++) {

            delete require.cache[require.resolve(`./${toReload[i].name}.js`)];

            try {
                const reload = require(`./${toReload[i].name}.js`);
                msg.client.commands.set(reload.name, reload);
    
                message += `:white_check_mark: - **${toReload[i].name}**\n`;

                console.log(`[INFO] Načítám ${toReload[i].name}.js`);
            
            } catch (error) {
                message += `:x: - **${toReload[i].name}**\n`;
                console.log(`Příkaz ${toReload[i].name}.js se nepovedlo načíst`);
                console.error(error);
            }

        }

        const embed = new MessageEmbed()
        .setTitle('**Načítání příkazů**')
        .setColor('#5cb85c')
        .setDescription(message);
        
        msg.channel.send(embed);

    }
};