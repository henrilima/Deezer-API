# API de dados de artistas e músicas (Consumindo a API da Deezer)
Esta API permite a pesquisa de artistas, álbuns e músicas usando a API do Deezer. Além disso, a API oferece a funcionalidade de gerar uma imagem de canvas personalizada com informações sobre os artistas e suas principais músicas.

## Funcionalidades
- **Teste da API**: Acesse `GET /api/` ou `GET /topsongs/` para verificar se a API está funcionando corretamente.
- **Buscar Artistas**: Utilize o endpoint `GET /api/artists?q={nome_do_artista}` para encontrar artistas com base no nome fornecido.
- **Informações do Artista**: Use `GET /api/artistinfo?q={id_do_artista}` para obter detalhes de um artista específico.
- **Buscar Álbuns**: Com `GET /api/albums?q={id_do_artista}`, você pode obter os álbuns de um artista pelo ID.
- **Buscar Faixas**: O endpoint `GET /api/tracks?q={nome_da_faixa}` permite buscar faixas pela consulta do nome.
- **Lista de Faixas do Álbum**: O endpoint `GET /api/tracklist?q={id_do_album}` retorna a lista de faixas de um álbum específico.
- **Geração de Canvas**: O endpoint `POST /canvas` cria uma imagem personalizada no formato PNG com detalhes do artista e suas cinco principais músicas, retornada como Blob. Para gerar o canvas, envie um corpo JSON contendo as seguintes propriedades:

  ```json5
  {
    "artist": {
      "name": "Nome do Artista", // -> OBRIGATÓRIO
      "color": "Cor em hexadecimal", // Padrão é "#FEB029"
      "opacity": "Opacidade (0 a 100)", // Padrão é 15%
      "icon": "URL do ícone do artista" // -> OBRIGATÓRIO
    },
    "songs": [ // -> OBRIGATÓRIO
      {
        "title": "Título da Música 1", // -> OBRIGATÓRIO
        "albumTitle": "Título do Álbum 1", // -> OBRIGATÓRIO
        "coverAlbum": "URL da Capa do Álbum 1" // -> OBRIGATÓRIO
      },
      {
        "title": "Título da Música 2", // "
        "albumTitle": "Título do Álbum 2", // "
        "coverAlbum": "URL da Capa do Álbum 2" // "
      },
      {
        "title": "Título da Música 3", // "
        "albumTitle": "Título do Álbum 3", // "
        "coverAlbum": "URL da Capa do Álbum 3" // "
      },
      {
        "title": "Título da Música 4", // "
        "albumTitle": "Título do Álbum 4", // "
        "coverAlbum": "URL da Capa do Álbum 4" // "
      },
      {
        "title": "Título da Música 5", // "
        "albumTitle": "Título do Álbum 5", // "
        "coverAlbum": "URL da Capa do Álbum 5" // "
      }
    ]
  }
  ```

## Como Usar
1. **Clone o repositório**:
 ```
 git clone https://github.com/henrilima/Deezer-API.git
 ```

2. **Instale as dependências**:
 ```
 yarn install
 ```

3. **Inicie o servidor**:
 ```
 yarn start
 ```

#

1. **Teste a API**:
Acesse `http://localhost:3000/api` para verificar se a API está funcionando.

1. **Realize uma busca**:
Faça uma requisição GET para `http://localhost:3000/api/artists?q={sua_consulta}` para buscar artistas, ou utilize outros endpoints conforme necessário.

1. **Gere um canvas**:
Envie uma requisição POST para `http://localhost:3000/api/canvas` com o corpo JSON mencionado acima, e passe a propriedade `responseType: "blob"`.

    *Example:*
    ```js
    await axios.post(
    `[http://localhost:3000/topsongs/canvas`, {
            songs: songsList,
            artist: {
                ...artist,
                color: colorHex,
                opacity: opacityPercentage,
            },
        },
        { responseType: "blob" }
    )
    .then(async (response) => {
        [image].src = URL.createObjectURL(response.data);
    })
    .catch((error) => {
        console.error("Erro:", error);
    })
    ```

## Exemplo de Resposta
Ao fazer uma requisição bem-sucedida para gerar um canvas, a resposta será uma imagem PNG/Blob contendo a arte personalizada com as informações do artista e suas músicas.

## Dependências Usadas
- Node.js
- Express
- Axios
- Canvas
- Cors
- Url
- Fs
- Path
- Body-Parser
- Nodemon **(dev)**

## Licença
Este projeto está licenciado sob a [Licença Apache v2.0](LICENSE).