const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Report = new Schema({
    latitude: Number,
    longitude: Number,
    denunciante: {
        nome: String,
        cpf: String
    },
    denuncia: {
        titulo: String,
        descricao: String
    },
    endereco:{
      logradouro: String,
      cidade: String,
      estado: String,
      pais: String,
      cep: String
    },
    titulo: String,
    descricao: String
});

mongoose.model('reports', Report)
