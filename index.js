const fs = require('fs');
require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventsFiles = fs
	.readdirSync('./events')
	.filter(file => file.endsWith('.js'));

for (const file of eventsFiles) {
	const event = require(`${__dirname}/events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(`${process.env.TOKEN}`);

module.exports = client;
