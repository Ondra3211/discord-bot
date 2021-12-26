const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { covidToken } = require('./../config.json');

module.exports = {
    name: 'covid',
    aliases: ['coronavirus', 'korona'],
    description: 'Koronavirus',
    async execute(msg, args) {

        try {
            const res = await fetch(`https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled?page=1&itemsPerPage=100&apiToken=${covidToken}`);
            const covidData = await res.json();
            const data = covidData["hydra:member"][0];
    
            const embed = new MessageEmbed()
                .setTitle('**:flag_cz: KORONAVIRUS**')
                .setColor('#5cb85c')
                .addFields(
                    { name: ':microbe: Aktivní', value: data.aktivni_pripady.toString() + '(' +  data.potvrzene_pripady_vcerejsi_den.toString() + ')', inline: false },
                    { name: ':pill: Vyléčení', value: data.vyleceni.toString(), inline: false },
                    { name: ':syringe: Očkováno', value: data.ockovane_osoby_celkem.toString() + '(' +  data.vykazana_ockovani_vcerejsi_den.toString() + ')', inline: false },
                    { name: ':skull: Úmrtí', value: data.umrti.toString(), inline: false }
                );
    
            msg.channel.send({ embeds: [embed] });
            
        } catch (err) {
            msg.channel.send(':x: Nastala chyba pri získávání informací');
        }

    }
};
