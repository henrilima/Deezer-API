import { Router } from "express";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const router = Router();

// Configurações para usar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rota para testar a API
router.get("/", async (req, res) => {
    res.json({ message: "API TopSongs rodando!" });
});

registerFont(path.join(__dirname, "..", "fonts", "Montserrat.ttf"), {
    family: "Montserrat",
});

router.post("/canvas", async (req, res) => {
    const body = req.body;

    const numbersPath = path.join(__dirname, "..", "images", "numbers.png");
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext("2d");

    try {
        // Lê a imagem do sistema de arquivos
        const numbersBuffer = fs.readFileSync(numbersPath);
        const numbersImage = await loadImage(numbersBuffer);

        // Preenche o canvas com a cor de fundo
        ctx.fillStyle = body.artist?.bodyColor || "#0E131F";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Determina o caminho do SVG com base no tipo recebido
        const svgFillList = ['3', '4'];
        const svgType = body.artist?.pattern || "1"; // Padrão para '1' se não especificado

        console.log(svgType);
        console.log(typeof svgType);

        const svgPath = path.join(
            __dirname,
            "..",
            "images",
            `tipo${String(svgType) === "1" ? "" : `_${svgType}`}.svg`
        );

        const modifiedSVG = loadSVGAndChangeColor(
            svgPath,
            body.artist.color,
            body.artist.opacity,
            !!svgFillList.includes(String(svgType))
        );

        if (String(svgType) === "1") {
            await drawSVGOnCanvas(canvas, ctx, modifiedSVG, 0, 433, 1080, 1700);
        } else {
            await drawSVGOnCanvas(canvas, ctx, modifiedSVG, 0, 0, 1080, 1920);
        }

        ctx.drawImage(numbersImage, 85, 1025, 80, 700);
        ctx.font = "48px Montserrat";
        ctx.fillStyle = "#FFFFFF33";
        ctx.fillText("topSongs", 820, 1890);

        const responseArtistIcon = await axios.get(body.artist.icon, {
            responseType: "arraybuffer",
        });
        const ArtistImage = await loadImage(
            Buffer.from(responseArtistIcon.data)
        );

        ctx.drawImage(ArtistImage, 235, 120, 610, 610);
        ctx.font = "64px Montserrat";
        ctx.fillStyle = "#D9D9D9";
        ctx.textAlign = "center";
        ctx.fillText(body.artist.name, canvas.width / 2, 840);
        ctx.textAlign = "start";

        const response_song_1 = await axios.get(body.songs[0].coverAlbum, {
            responseType: "arraybuffer",
        });
        const song_1 = await loadImage(Buffer.from(response_song_1.data));
        ctx.drawImage(song_1, 205, 980, 126, 126);
        drawTitleWithEllipsis(ctx, body.songs[0].title, 372, 980 + 50, 590);
        drawAlbumNameWithEllipsis(
            ctx,
            body.songs[0].albumTitle,
            372,
            980 + 50 + 50,
            590
        );

        const response_song_2 = await axios.get(body.songs[1].coverAlbum, {
            responseType: "arraybuffer",
        });
        const song_2 = await loadImage(Buffer.from(response_song_2.data));
        ctx.drawImage(song_2, 205, 1146, 126, 126);
        drawTitleWithEllipsis(ctx, body.songs[1].title, 372, 1146 + 50, 590);
        drawAlbumNameWithEllipsis(
            ctx,
            body.songs[1].albumTitle,
            372,
            1146 + 50 + 50,
            590
        );

        const response_song_3 = await axios.get(body.songs[2].coverAlbum, {
            responseType: "arraybuffer",
        });
        const song_3 = await loadImage(Buffer.from(response_song_3.data));
        ctx.drawImage(song_3, 205, 1314, 126, 126);
        drawTitleWithEllipsis(ctx, body.songs[2].title, 372, 1314 + 50, 590);
        drawAlbumNameWithEllipsis(
            ctx,
            body.songs[2].albumTitle,
            372,
            1314 + 50 + 50,
            590
        );

        const response_song_4 = await axios.get(body.songs[3].coverAlbum, {
            responseType: "arraybuffer",
        });
        const song_4 = await loadImage(Buffer.from(response_song_4.data));
        ctx.drawImage(song_4, 205, 1478, 126, 126);
        drawTitleWithEllipsis(ctx, body.songs[3].title, 372, 1478 + 50, 590);
        drawAlbumNameWithEllipsis(
            ctx,
            body.songs[3].albumTitle,
            372,
            1478 + 50 + 50,
            590
        );

        const response_song_5 = await axios.get(body.songs[4].coverAlbum, {
            responseType: "arraybuffer",
        });
        const song_5 = await loadImage(Buffer.from(response_song_5.data));
        ctx.drawImage(song_5, 205, 1644, 126, 126);
        drawTitleWithEllipsis(ctx, body.songs[4].title, 372, 1644 + 50, 590);
        drawAlbumNameWithEllipsis(
            ctx,
            body.songs[4].albumTitle,
            372,
            1644 + 50 + 50,
            590
        );

        // Converte o canvas para um buffer e envia como resposta
        const buffer = canvas.toBuffer("image/png");
        res.set("Content-Type", "image/png");
        res.send(buffer);
    } catch (error) {
        console.error("Erro ao carregar a imagem:", error);
        res.status(500).send("Erro ao carregar a imagem.");
    }
});

function drawTitleWithEllipsis(ctx, text, x, y, maxWidth) {
    // Define o estilo do texto
    ctx.font = "40px Montserrat";
    ctx.fillStyle = "white";

    // Medir o texto
    let ellipsis = "...";
    let ellipsisWidth = ctx.measureText(ellipsis).width;
    let textWidth = ctx.measureText(text).width;

    // Verifica se o texto é maior do que o maxWidth permitido
    if (textWidth > maxWidth) {
        // Tentar ajustar o texto para caber na largura, subtraindo o espaço das reticências
        let trimmedText = text;
        while (ctx.measureText(trimmedText).width + ellipsisWidth > maxWidth) {
            trimmedText = trimmedText.slice(0, -1); // Remove o último caractere
        }
        // Adiciona as reticências no final
        text = trimmedText + ellipsis;
    }

    // Desenha o texto ajustado no canvas
    ctx.fillText(text, x, y);
}

function drawAlbumNameWithEllipsis(ctx, text, x, y, maxWidth) {
    // Define o estilo do texto
    ctx.font = "32px Montserrat";
    ctx.fillStyle = "grey";

    // Medir o texto
    let ellipsis = "...";
    let ellipsisWidth = ctx.measureText(ellipsis).width;
    let textWidth = ctx.measureText(text).width;

    // Verifica se o texto é maior do que o maxWidth permitido
    if (textWidth > maxWidth) {
        // Tentar ajustar o texto para caber na largura, subtraindo o espaço das reticências
        let trimmedText = text;
        while (ctx.measureText(trimmedText).width + ellipsisWidth > maxWidth) {
            trimmedText = trimmedText.slice(0, -1); // Remove o último caractere
        }
        // Adiciona as reticências no final
        text = trimmedText + ellipsis;
    }

    // Desenha o texto ajustado no canvas
    ctx.fillText(text, x, y);
}

function loadSVGAndChangeColor(svgPath, newColor = "b22222", opacity = "20", hasFill = false) {
    // Carregar o arquivo SVG local como texto
    let svg = fs.readFileSync(svgPath, "utf8");
    newColor = newColor.replace("#", "");
    const color = `#${newColor}${Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}`;

    // Substituir a cor original pelo novo valor (modifica o atributo 'fill')
    // Replace stroke color and add stroke-opacity
    if (hasFill) {
        svg = svg.replace(/fill="[^"]*"/g, `fill="#${newColor}" fill-opacity="${opacity / 100}"`);
        svg = svg.replace(/stroke="[^"]*"/g, `stroke="#${newColor}" stroke-opacity="${opacity / 100}"`);
    } else {
        svg = svg.replace(/stroke="[^"]*"/g, `stroke="#${newColor}" stroke-opacity="${opacity / 100}"`);
    }
    // Replace fill color and add fill-opacity

    return svg; // Retorna o SVG modificado
}

async function drawSVGOnCanvas(canvas, ctx, svgData, x, y, width, height) {
    // Converter o SVG para uma imagem usando data URL
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(
        svgData
    ).toString("base64")}`;

    // Carregar a imagem SVG
    const img = await loadImage(svgDataUrl);

    // Desenhar a imagem no canvas
    ctx.drawImage(img, x, y, width, height);

    // Retornar o buffer da imagem gerada
    return canvas.toBuffer();
}

export default router;
