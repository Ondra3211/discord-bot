const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'covid',
	description: 'Koronavirus',
	async execute(msg, args) {

        fetch('https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true')
        .then(res => res.json())
        .then(json => {

            const embed = new MessageEmbed()
            .setTitle('**:flag_cz: KORONAVIRUS**')
            .setColor('#5cb85c')
            .addFields(
                { name: ':egg: Potvrzeno', value: json.active, inline: true },
                { name: ':syringe: Úmrtí', value: json.deceased, inline: true },
                { name: ':pill: Vyléčení', value: json.recovered, inline: true }
            )
    
            msg.channel.send(embed);

        }).catch(err => msg.channel.send(':x: Nastala chyba pri získávání informací'));
        
	}
};