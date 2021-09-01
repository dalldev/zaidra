const fetch = require('node-fetch');

const root = 'https://gameinfo.albiononline.com/api/gameinfo';

const search = async element => {
	const resItems = await fetch(`${root}/search?q=${element}`);
	const items = await resItems.json();

	return items;
};

const players = async nickname => {
	const peticion = {
		error: false,
		pedido: null,
	};
	if (!nickname) {
		peticion.error = 'No se ingresó el Apodo.';
		return peticion;
	}

	if (nickname.trim().includes(' ')) {
		peticion.error = 'No se permiten Espacios.';
		return peticion;
	}

	const { players } = await search(nickname);

	if (!players) {
		peticion.error = 'No se encontraron Jugadores con ese apodo.';
		return peticion;
	} else {
		peticion.pedido = players;
		return peticion;
	}
};

const player = async id => {
	const peticion = {
		error: false,
		pedido: null,
	};

	if (!id) {
		peticion.error = 'No se ingresó el identificador.';
		return peticion;
	}

	const ressUser = await fetch(`${root}/players/${id}`);
	const user = await ressUser.json();

	if (!user) {
		peticion.error = 'No se enctro Jugador con ese identificador.';
		return peticion;
	} else {
		peticion.pedido = user;
		return peticion;
	}
};

module.exports = { players, player };
