const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { covidToken } = require('./../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('covid')
    .setDescription('Aktualni COVID informace'),
    async execute(inter) {

        try {
            const res = await fetch(`https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled?page=1&itemsPerPage=100&apiToken=${covidToken}`);
            const covidData = await res.json();
            const data = covidData["hydra:member"][0];
    
            const embed = new MessageEmbed()
                .setTitle('**:flag_cz: KORONAVIRUS**')
                .setColor('#5cb85c')
                .addFields(
                    { name: ':microbe: Aktivní', value: data.aktivni_pripady.toLocaleString('cs-CZ') + ' (+' +  data.potvrzene_pripady_vcerejsi_den.toLocaleString() + ')', inline: false },
                    { name: ':pill: Vyléčení', value: data.vyleceni.toLocaleString('cs-CZ'), inline: false },
                    { name: ':syringe: Očkováno', value: data.ockovane_osoby_celkem.toLocaleString('cs-CZ') + ' (+' +  data.vykazana_ockovani_vcerejsi_den.toLocaleString() + ')', inline: false },
                    { name: ':skull: Úmrtí', value: data.umrti.toLocaleString('cs-CZ'), inline: false }
                );
    
            inter.reply({ embeds: [embed] });
            
        } catch (err) {
            inter.reply(':x: Nastala chyba pri získávání informací');
        }

    }
};
