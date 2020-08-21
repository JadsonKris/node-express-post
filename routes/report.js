const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
var http = require('http');
const axios = require('axios');
require("../models/report")
const Report = mongoose.model("reports")
const key = "bwPkZneCS02IRCLBrC3pZaxvA1J8Agu4"

const cache = {}

router.get('/',(req, res) => {
  res.render('report')
})

function addReport(req){
  let location = String(req.latitude) +", " +String(req.longitude)
  if(!cache[location]){
    axios.all([
      axios.get('http://www.mapquestapi.com/geocoding/v1/reverse?key=' + key + '&location=' + location + '&includeRoadMetadata=true&includeNearestIntersection=true'),
    ]).then(axios.spread((response1) => {
      cache[location] = response1.data

      if (cache[location].info.statuscode == 0){
        let newReport = {
          latitude: req.latitude,
          longitude: req.longitude,
          denunciante:{
            nome: req.nome,
            cpf: req.cpf
          },
          endereco:{
            logradouro: response1.data.results[0].locations[0].street,
            cidade: response1.data.results[0].locations[0].adminArea5,
            estado: response1.data.results[0].locations[0].adminArea3,
            pais: response1.data.results[0].locations[0].adminArea1
          }
        }

        console.log(newReport)
      }else{

      }
    })).catch(error => {
      console.log(error);
    });
  }
}

function addReport(latitude, longitude,nome, cpf, titulo, descricao ,response){
  console.log(response)
  if(response.info.statuscode == 0 && response.results){
    try{
      let newReport = {
        latitude: latitude,
        longitude: longitude,
        denunciante:{
          nome: nome,
          cpf: cpf
        },
        endereco:{
          logradouro: response.results[0].locations[0].street,
          cidade: response.results[0].locations[0].adminArea5,
          estado: response.results[0].locations[0].adminArea3,
          pais: response.results[0].locations[0].adminArea1
        },
        titulo: titulo,
        descricao: descricao
      }
      new Report(newReport).save()
      return newReport
    }catch{
      return {error:{code:2, message:"Endereço não encontrado para essa localidade."}}

    }
  }else{
    return {error:{code:2, message:"Endereço não encontrado para essa localidade."}}
  }

}

router.post("/new", (req, res) => {
  console.log(req.body)

  let location = String(req.body.latitude) +", " +String(req.body.longitude)

  if(cache[location]){
    console.log("Cache Hit")
    res.send(addReport(req.body.latitude, req.body.longitude, req.body.nome, req.body.CPF, req.body.titulo, req.body.descricao, cache[location]))
  }else{
    console.log("Cache Miss")

    axios.all([
      axios.get('http://www.mapquestapi.com/geocoding/v1/reverse?key=' + key + '&location=' + location + '&includeRoadMetadata=true&includeNearestIntersection=true'),
    ]).then(axios.spread((response1) => {
      cache[location] = response1.data
      res.send(addReport(req.body.latitude, req.body.longitude, req.body.nome, req.body.CPF, req.body.titulo, req.body.descricao, cache[location]))
    })).catch(error => {
      console.log(error);
    });
  }
})

module.exports = router
