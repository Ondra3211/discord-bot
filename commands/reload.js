module.exports = {
	name: 'reload',
	description: '',
	async execute(msg, args) {
        
        if (msg.author.id !== '319537484734398466') return;

        if (!args[0]) {
            msg.channel.send(':x: Musíš zadat název příkazu!');
            return;
        }

        const commandName = args[0].toLowerCase();
        const command = msg.client.commands.get(commandName);

        if (!command) {
            msg.channel.send(`:x: Příkaz \`${args[0]}\` neexistuje`);
            return;
        }

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const reload = require(`./${command.name}.js`);
            msg.client.commands.set(reload.name, reload);

            msg.channel.send(`:white_check_mark: Příkaz \`${command.name}\` byl úspěšně načten`);
            console.log(`[DEBUG] Prikaz ${command.name} byl nacten`);
        
        } catch (error) {
            msg.channel.send(':x: Nepodařilo se načíst příkaz');
            console.error(error);
        }

    }
};