# Circuito Saquarema Verde

Aplicativo web mobile/PWA para consultar trilhas, lugares naturais e regras ambientais em Saquarema.

## O que foi adaptado

- Interface responsiva para celular.
- Instalação como aplicativo no Android/iOS pelo navegador.
- Manifesto PWA, service worker, ícones e tela offline.
- Correção das rotas de trilhas, lugares e recomendações.
- Painel administrativo mobile para cadastrar novos conteúdos.
- Criação automática do `data.json` quando o arquivo não existir.

## Como rodar

```bash
npm install
npm start
```

Depois abra:

```text
http://localhost:3000
```

## Como instalar no celular

1. Rode o servidor ou publique o projeto em um serviço web.
2. Abra o endereço pelo navegador do celular.
3. Use a opção "Adicionar à tela inicial" ou "Instalar aplicativo".

## Painel administrativo

Acesse:

```text
http://localhost:3000/admin.html
```

No primeiro acesso, crie o administrador inicial no próprio painel. Depois faça login e cadastre trilhas, lugares e recomendações.

## Tecnologias

- Node.js
- Express
- HTML
- CSS
- JavaScript
- PWA
