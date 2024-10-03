// api/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Criando a instância do Express.js
const app = express();
app.use(bodyParser.json());

// Definindo a porta
const port = process.env.PORT || 3000;
// Habilitar CORS globalmente
app.use(cors());

// Importando rotas do sistema TopSongs
import topSongs from "./topsongs.js";
import apiDeezer from "./api.js";

// Importando rotas
app.use("/topsongs", topSongs);
app.use("/api", apiDeezer);

// Rota padrão para páginas não encontradas
app.use("*", (req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
});

// Iniciando a API
app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});

export default app;
