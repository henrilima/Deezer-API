// api/hello.js

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

// Habilitar CORS globalmente
app.use(cors());

// Rota para buscar artistas da API do Deezer
app.get('/api/artists', async (req, res) => {
  const artistName = req.query.q; // Obtendo o nome do artista dos parâmetros de consulta

  if (!artistName) {
    return res.status(400).json({ error: 'Você deve fornecer um nome de artista na consulta.' });
  }

  try {
    const response = await axios.get(`https://api.deezer.com/search/artist?q=${artistName}`);
    res.status(200).json(response.data); // Retornando os dados recebidos da API do Deezer
  } catch (error) {
    console.error('Erro ao buscar dados do Deezer:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do Deezer.' });
  }
});

// Outra rota de exemplo
app.get('/api/tracks', async (req, res) => {
  const trackName = req.query.q; // Obtendo o nome da faixa dos parâmetros de consulta

  if (!trackName) {
    return res.status(400).json({ error: 'Você deve fornecer um nome de faixa na consulta.' });
  }

  try {
    const response = await axios.get(`https://api.deezer.com/search/track?q=${trackName}`);
    res.status(200).json(response.data); // Retornando os dados recebidos da API do Deezer
  } catch (error) {
    console.error('Erro ao buscar dados do Deezer:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do Deezer.' });
  }
});

// Rota de teste

app.get('/api/test', (req, res) => {
  res.json({ message: 'API rodando!' });
});

// Iniciando a API
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

export default app;
