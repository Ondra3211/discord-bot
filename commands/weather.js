const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'weather',
    description: 'Počasí',
    async execute(msg, args) {
        if (!args[0]) {
            args[0] = 'Praha';
        }

        const city = args.join(' ');
        const cityEncoded = encodeURI(city);

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityEncoded},CZ&units=metric&lang=CZ&appid=f3e1531955a61dfcfd5c193078fbc705`)
            .then(res => res.json())
            .then(json => {

                if (json.cod == 404) return msg.channel.send(`:x: Město \`${city}\` neexistuje`);

                const embed = new MessageEmbed()
                    .setTitle('**Počasí**')
                    .setColor('#5cb85c')
                    .setDescription(`${json.name} - ${json.weather[0].description}`)
                    .addFields(
                        { name: ':thermometer: Teplota', value: `${json.main.temp} °C`, inline: true },
                        { name: ':wind_blowing_face: Rychlost větru', value: `${json.wind.speed} m/s`, inline: true },
                        { name: ':cloud: Oblačnost', value: `${json.clouds.all} %`, inline: true }
                    )
                    .setThumbnail(`https://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png`)
                    .setTimestamp();

                msg.channel.send({ embeds: [embed] });

            }).catch(err => msg.channel.send(':x: Nastala chyba při získávání počasí'));

    }
};