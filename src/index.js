import express from "express";
import swaggerUI from "swagger-ui-express";
import { readFileSync } from "fs";
import morgan from "morgan";

const swaggerDocument = JSON.parse(
  readFileSync(new URL("./../swagger.json", import.meta.url))
);

let pokemonsData = JSON.parse(
  readFileSync(new URL("./../pokemons.json", import.meta.url))
);

const app = express();

const port = 8000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Pokemon API with Swagger");
});

app.get("/pokemons", (req, res) => {
  res.send(pokemonsData);
});

app.get("/pokemons/:pokemon", (req, res) => {
  let pokemon = pokemonsData.find(
    (pokemon) => pokemon.id === parseInt(req.params.pokemon)
  );

  res.send(pokemon).status(200);
});

app.post("/pokemons", (req, res) => {
  pokemonsData.push(req.body);

  res.send(pokemonsData).status(200);
});

app.put("/pokemons/:pokemon", (req, res) => {
  pokemonsData[parseInt(req.params.pokemon) + 1] = req.body;

  res.send(pokemonsData[parseInt(req.params.pokemon) + 1]).status(200);
});

app.delete("/pokemons/:pokemon", (req, res) => {
  pokemonsData = pokemonsData.filter(
    (pokemon) => pokemon.id !== parseInt(req.params.pokemon)
  );

  res.send(pokemonsData).status(200);
});

app.use(morgan("dev"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`[Server] listening on: http://localhost:${port}`);
});
