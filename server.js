// Carregando modulos
  const express = require('express');
  const handlebars = require('express-handlebars');
  const bodyParser = require('body-parser');
  const app = express()
  const report = require("./routes/report.js")
  const mongoose = require("mongoose")
// Configurações
  // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
  // handlebars
    app.engine("handlebars", handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
  // Mongoose
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/reports', { useNewUrlParser: true, useUnifiedTopology: true})
  .then( () => {console.log("MongoDB Connection Succeeded.")})
  .catch( (error) => {console.log('Error in DB connection : ' + err)} )

// Rotas
    app.use("/", report)
// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log('Express server started at port :'+ PORT);
});
