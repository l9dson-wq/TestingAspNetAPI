const express = require('express');
const app = express();
const PORT = process.env.PORT || 5050;
const path = require("path");
const axios = require("axios");
const https = require('https');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.set("views", path.join(__dirname, "/Views"));
app.use(express.static(path.join(__dirname, "/Public")));

const agent = new https.Agent({
  rejectUnauthorized: false 
});

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  })
});

//GET REQUEST | STATUS: WORKING
app.get('/getRequest', (req, res) => {

  let pokemons;

  axios.get("https://localhost:7128/api/Pokemon/GetAllPokemon", { httpsAgent: agent })
    .then(response => {
      // console.log(response.data);
      pokemons = response.data;
      // res.send(response.data);
    })
    .catch(error => { console.log(error); })
    .finally(() => {
      res.render("Index", {
        title: "Testing API",
        pokemons,
      })
    })
});

//POST REQUEST | STATUS: WORKING
app.post('/postRequest', async (req, res) => {

  const { Name, PrimaryType, SecondaryType, TrainerId } = req.body;
  
  try{
    instance.post('https://localhost:7128/api/Pokemon/AddPokemon', { 
      Name, 
      PrimaryType, 
      SecondaryType, 
      TrainerId,
     })
    .then(response => {
      // console.log(response);
      res.redirect('/getRequest');
    })
    .catch(error => {
      console.log(error.cause);
    })
  } catch (error){
    console.log("There was an error trying to create a pokemon, check post request controller", error);
  }
});

//DELETE REQUEST | STATUS: WORKING
app.post('/deleteRequest', async (req, res) => {

  const pokemonId = parseInt(req.body.PokemonId);

  console.log(typeof parseInt(pokemonId));

  try{
    instance.delete(`https://localhost:7128/api/Pokemon/DeletePokemon?id=${pokemonId}`, {
      id: pokemonId,
    })
    .then(response => {
      // console.log(response.data);
      res.redirect('/getRequest');
    })
    .catch(error => console.log(error));
  } catch (error){
    console.log(error.cause);
  }
});

//GET BY ID REQUEST | STATUS: WORKING 
app.post('/getByIdRequest', (req, res) => {
  const pokemonId = parseInt(req.body.PokemonId);

  try{
    instance.post(`https://localhost:7128/api/Pokemon/GetById?Id=${pokemonId}`, {
      Id: pokemonId,
    })
    .then(response => {
      // console.log(response.data);
      // res.redirect('/getRequest');
      res.render('EditPokemon', {
        title: 'Editing pokemon',
        pokemonInfo: response.data
      });
    })
    .catch(error => console.log(error));
  } catch (error){
    console.log(error.cause);
  }
});

//UPDATE REQUEST
app.post('/updateRequest', (req, res) => {
  const { Name, PrimaryType, SecondaryType, TrainerId, pokemonId } = req.body;

  console.log({ Name, PrimaryType, SecondaryType, TrainerId, pokemonId });
  
  try{
    instance.put('https://localhost:7128/api/Pokemon/EditPokemon', { 
      Id: pokemonId,
      Name, 
      PrimaryType, 
      SecondaryType, 
      TrainerId,
     })
    .then(response => {
      // console.log(response);
      res.redirect('/getRequest');
    })
    .catch(error => {
      console.log(error);
    })
  } catch (error){
    console.log("There was an error trying to edit a pokemon, check post request controller", error);
  }
});

app.listen(PORT, function() {
  console.log(`Port is being listening on http://www.localhost:${PORT}`);
});