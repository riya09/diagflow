# DiagFlow AI

DiagFlow allows you to create diagrams/flowcharts easily using natural language. It uses Google's Gemma 3 (27B) model via the OpenRouter API.

<img width="100%" alt="Screenshot 2025-05-10 at 5 42 58 PM" src="https://github.com/user-attachments/assets/4f9900a0-9d3a-4e9d-a861-eb661b90a10c" />


## Key Features

- Convert text descriptions into diagrams
- Modify color and text of each shapes.
- Download diagram as SVG
- Multiple persistent chats and diagrams with browser-based storage

## Tech Stack

- Vue 3 with Vite
- d3.js and d3-graphviz for diagram rendering
- OpenRouter API for AI model access

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
