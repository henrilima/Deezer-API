// api/api.js
import { Router } from "express";
const router = Router();

// Importando bibliotecas
import axios from "axios";

// Rota para testar a API
router.get("/", (req, res) => {
    res.json({ message: "API que se conecta a Deezer API rodando!" });
});

// Rota para buscar artistas da API do Deezer
router.get("/artists", async (req, res) => {
    const artistName = req.query.q; // Obtendo o nome do artista dos parâmetros de consulta

    if (!artistName) {
        return res.status(400).json({
            error: "Você deve fornecer um nome de artista na consulta.",
        });
    }

    try {
        const response = await axios.get(
            `https://api.deezer.com/search/artist?q=${artistName}`
        );
        res.status(200).json(response.data); // Retornando os dados recebidos da API do Deezer
    } catch (error) {
        console.error("Erro ao buscar dados do Deezer:", error);
        res.status(500).json({
            error: "Erro ao buscar dados do Deezer.",
            message: error.message,
        });
    }
});

router.get("/artistinfo", async (req, res) => {
    const artistId = req.query.q; // Obtendo o nome do artista dos parâmetros de consulta

    if (!artistId) {
        return res.status(400).json({
            error: "Você deve fornecer um nome de artista na consulta.",
        });
    }

    try {
        const response = await axios.get(
            `https://api.deezer.com/artist/${artistId}`
        );
        res.status(200).json(response.data); // Retornando os dados recebidos da API do Deezer
    } catch (error) {
        console.error("Erro ao buscar dados do Deezer:", error);
        res.status(500).json({
            error: "Erro ao buscar dados do Deezer.",
            message: error.message,
        });
    }
});

// Rota para buscar faixas da API do Deezer
router.get("/tracks", async (req, res) => {
    const trackName = req.query.q; // Obtendo o nome da faixa dos parâmetros de consulta

    if (!trackName) {
        return res.status(400).json({
            error: "Você deve fornecer um nome de faixa na consulta.",
        });
    }

    try {
        const response = await axios.get(
            `https://api.deezer.com/search/track?q=${trackName}`
        );
        res.status(200).json(response.data); // Retornando os dados recebidos da API do Deezer
    } catch (error) {
        console.error("Erro ao buscar dados do Deezer:", error);
        res.status(500).json({ error: "Erro ao buscar dados do Deezer." });
    }
});

// Rota para buscar as capas dos álbuns pelo ID do artista
router.get("/albums", async (req, res) => {
    const artistId = req.query.q;

    if (!artistId) {
        return res.status(400).json({
            error: "Você deve fornecer um ID de artista na consulta.",
        });
    }

    try {
        const albums = [];
        const response = await axios.get(
            `https://api.deezer.com/artist/${artistId}/albums`
        );
        const responseArtist = await axios.get(
            `http://localhost:3000/api/artistinfo?q=${artistId}`
        );

        for (const album of response.data.data) {
            const albumData = {
                id: album.id,
                title: album.title,
                cover: album.cover_big,
                release_data: album.release_data,
                tracklist: album.tracklist,
            };
            albums.push(albumData);
        }

        const albunsData = {
            artist: {
                id: artistId,
                name: responseArtist.data.name,
            },
            albums,
        };
        res.status(200).json(albunsData); // Retornando os dados recebidos da API do Deezer
    } catch (error) {
        console.error("Erro ao buscar dados do Deezer:", error);
        res.status(500).json({ error: "Erro ao buscar dados do Deezer." });
    }
});

router.get("/tracklist", async (req, res) => {
    const albumId = req.query.q;

    if (!albumId) {
        return res.status(400).json({
            error: "Você deve fornecer o ID do álbum na consulta.",
        });
    }

    try {
        const tracklist = [];

        const response = await axios.get(
            `https://api.deezer.com/album/${albumId}/tracks`
        );
        for (const song of response.data.data) {
            const songData = {
                id: song.id,
                title: song.title,
                duration: song.duration,
                track_position: song.track_position,
                explicit_lyrics: song.explicit_lyrics,
                preview: song.preview,
            };
            tracklist.push(songData);
        }

        res.status(200).json(tracklist); // Retornando os dados recebidos da API do Deezer
    } catch (error) {
        console.error("Erro ao buscar dados do Deezer:", error);
        res.status(500).json({ error: "Erro ao buscar dados do Deezer." });
    }
});

export default router;
