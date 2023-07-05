const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'RestAPIdb';
const door = 3000;

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);

MongoClient.connect(url, {useNewUrlParser: true}, function(error, client) {
	if(error) console.log('ERRO de conexão:', error);
	else console.log('banco de dados conectado com sucesso.');

	db = client.db(dbName);
});

app.listen(door);
console.log(`servidor rodando em: localhost:${door}`);

function getCode() {
	try {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const milliseconds = date.getMilliseconds();
		const values = year+''+month+''+day+''+hours+''+minutes+''+seconds+''+milliseconds;
		const result = Number(parseFloat(Number(values)/2).toFixed(0));
		return result;
	}catch(error) {
		console.log({erro: error});
		return 0;
	}
}

app.get('/', urlencodedParser, function(req, res) {
	try {
		res.send({resposta: 'Seja muito bem vindo a nossa RESTful API com Node.js'});
	}catch(error) {
		console.log({erro: error});
		res.send({erro: error});
	}
});

app.get('/pessoas', urlencodedParser, function(req, res) {
	try {
		res.send({resposta: 'Cadastro de Pessoas'});
	}catch(error) {
		console.log({erro: error});
		res.send({erro: error});
	}
});

app.post('/pessoas/insert', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.codigo) objJSON.codigo = Number(req.body.codigo);
		else objJSON.codigo = getCode();

		if(req.body.nome) objJSON.nome = req.body.nome.toString().trim();
		else objJSON.nome = 'Anônimo';

		if(req.body.idade) objJSON.idade = Number(req.body.idade);
		else objJSON.idade = 18;

		if(req.body.email) objJSON.email = req.body.email.toString().trim();
		else objJSON.email = '';

		insertPerson(objJSON, function(result) {
			res.send(result);
		});
	}catch(error) {
		console.log({erro: error});
		res.send({erro: error});
	}
});

const insertPerson = function(objJSON, callback) {
	try {
		const collection = db.collection('pessoas');
		collection.insertOne(objJSON, function(error, result) {
			if(error) callback(error);
			else callback(result);
		});
	}catch(error) {
		console.log({erro: error});
	}
}

app.get('/pessoas/find/:codigo', urlencodedParser, function(req, res) {
	try {
		let codigo = 0;
		if(req.params.codigo) codigo = Number(req.params.codigo);

		let objJSON = {
			codigo: codigo
		}

		findPersonOne(objJSON, function(result) {
			res.send(result);
		});
	}catch(error) {
		console.log({erro: error});
		res.send({erro: error});
	}	
});

const findPersonOne = function(objJSON, callback) {
	try {
		const collection = db.collection('pessoas');
		collection.findOne(objJSON, function(error, result) {
			if(error) callback(error);
			else callback(result);
		});
	}catch(error) {
		console.log({erro: error});
	}
}

app.get('/pessoas/find', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.query.codigo) objJSON.codigo = Number(req.query.codigo);
		if(req.query.nome) objJSON.nome = req.query.nome.toString().trim();
		if(req.query.idade) objJSON.idade = Number(req.query.idade);
		if(req.query.email) objJSON.email = req.query.email.toString().trim();

		findPerson(objJSON, function(result) {
			res.send(result);
		});
	}catch(error) {
		console.log({erro: error});
		res.send({erro: error});
	}	
});

const findPerson = function(objJSON, callback) {
	try {
		const collection = db.collection('pessoas');
		collection.find(objJSON).toArray(function(error, result) {
			if(error) callback(error);
			else callback(result);
		});
	}catch(error) {
		console.log({erro: error});
	}
}

app.put('/pessoas/update/:codigo', urlencodedParser, function(req, res) {
	try {
		let codigo = 0;
		if(req.params.codigo) codigo = Number(req.params.codigo);

		let objJSON = {};
		if(req.body.codigo) objJSON.codigo = Number(req.body.codigo);
		if(req.body.nome) objJSON.nome = req.body.nome.toString().trim();
		if(req.body.idade) objJSON.idade = Number(req.body.idade);
		if(req.body.email) objJSON.email = req.body.email.toString().trim();

		updatePerson(objJSON, codigo, function(result) {
			res.send(result);
		});
	}catch(error) {
		console.log({erro: error});
		res.send({erro: error});
	}
});

const updatePerson = function(objJSON, codigo, callback) {
	try {
		const collection = db.collection('pessoas');
		collection.updateOne({codigo: codigo}, {$set: objJSON}, function(error, result) {
			if(error) callback(error);
			else callback(result);
		});
	}catch(error) {
		console.log({erro: error});
	}
}

app.delete('/pessoas/delete/:codigo', urlencodedParser, function(req, res) {
	try {
		let codigo = 0;
		if(req.params.codigo) codigo = Number(req.params.codigo);

		let objJSON = {
			codigo: codigo
		}

		deletePerson(objJSON, function(result) {
			res.send(result);
		});
	}catch(error) {
		console.log({erro: error});
		res.send({erro: error});
	}	
});

const deletePerson = function(objJSON, callback) {
	try {
		const collection = db.collection('pessoas');
		collection.deleteOne(objJSON, function(error, result) {
			if(error) callback(error);
			else callback(result);
		});
	}catch(error) {
		console.log({erro: error});
	}
}
