const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'covid',
    aliases: ['coronavirus', 'korona'],
    description: 'Koronavirus',
    async execute(msg, args) {

        fetch('https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/zakladni-prehled.json')
            .then(res => res.json())
            .then(({ data }) => {
                
                const embed = new MessageEmbed()
                    .setTitle('**:flag_cz: KORONAVIRUS**')
                    .setColor('#5cb85c')
                    .addFields(
                        { name: ':microbe: Aktivní', value: data[0].aktivni_pripady, inline: true },
                        { name: ':syringe: Úmrtí', value: data[0].umrti, inline: true },
                        { name: ':pill: Vyléčení', value: data[0].vyleceni, inline: true }
                    );

                msg.channel.send(embed);

            }).catch(err => msg.channel.send(':x: Nastala chyba pri získávání informací'));

    }
};