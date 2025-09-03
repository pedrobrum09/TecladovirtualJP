# Teclado Virtual Japonês (MVP)

Objetivo: MVP de um teclado virtual japonês com conversão Romaji→Kana no cliente, sugestões com candidatos/kanji, conjugação completa e exemplos de frases. UI bilíngue PT/JP.

## Estrutura

- backend (Node.js + Express)
  - Rotas: `/api/suggest`, `/api/define`, `/api/conjugate`, `/api/examples`, `/api/kanji/:char`
  - Serviços: Jotoba (vocabulário), Tatoeba (exemplos), KanjiAPI (kanji)
  - Núcleo: normalização, ranking, conjugador
  - Middlewares: cache LRU, rate limit, errors
- frontend (HTML/CSS/JS puro)
  - `index.html`, `styles.css`
  - `ime.js` (composição + atalhos + wanakana), `api.js`, `i18n.js`
  - Components: `suggestions.js`, `detailsPanel.js`

## Requisitos de sistema
- Node.js 18+

## Instalação

```bash
npm install
```

## Variáveis de ambiente
Crie `.env` na raiz (já há um exemplo preenchido):

```
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
JOTOBA_BASE_URL=https://jotoba.de/api
TATOEBA_BASE_URL=https://tatoeba.org
KANJI_BASE_URL=https://kanjiapi.dev/v1
TIMEOUT_MS=5000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

## Execução (dev)

- Backend (3001):

```bash
npm run dev:backend
```

- Frontend (3000):

```bash
npm run dev:frontend
```

Abra http://localhost:3000

## Atalhos
- Ctrl+/ alterna idioma da UI (PT/JP)
- Ctrl+K alterna Hiragana/Katakana
- Espaço navega candidatos
- Enter confirma candidato
- Esc limpa buffer

## Limitações conhecidas (MVP)
- Adaptadores das APIs Jotoba/Tatoeba usam mapeamentos defensivos; esquemas reais podem variar.
- Leitura (furigana) nos exemplos não é gerada.
- Conjugador cobre principais formas; nuances ortográficas não padronizadas não foram tratadas.

## Testes

```bash
npm test
```

## Licença
MIT