
module.exports = {
    name: 'purge',
    aliases: ['clear'],
    permission: ['MANAGE_MESSAGES'],
    description: 'Smaže zadaný počet zpráv',
	async execute(msg, args) {

        let count = 100;

        if (args[0] && parseInt(args[0]))
            count = (parseInt(args[0]) + 1);

        if (args[0] && (count < 1 || count > 100))
            return msg.channel.send(':x: Mohu smazat zprávy pouze v rozmezí `0-100`');

        msg.channel.bulkDelete(count, true).then(messages => {
            msg.channel.send(`:white_check_mark: Smazáno ${(messages.size - 1)} zpráv`).then(message => {
                message.delete({ timeout: 10000 });
            })
        });
	}
};
