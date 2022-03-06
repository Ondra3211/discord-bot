const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder().setName('weather')
    .setDescription('Pocasi v dane lokalite')
    .addStringOption(option => option.setName('mesto').setDescription('Mesto')),
    async execute(inter) {
        const city = inter.options.getString('mesto') || 'Praha';
        const cityEncoded = encodeURI(city);

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityEncoded},CZ&units=metric&lang=CZ&appid=f3e1531955a61dfcfd5c193078fbc705`);
        const json = await res.json();    

        if (json.cod == 404) return inter.reply(`:x: Město \`${city}\` neexistuje`);

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

        inter.reply({ embeds: [embed] });

    }
};