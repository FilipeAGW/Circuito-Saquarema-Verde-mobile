
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
=======
# Projeto Mobile Saquarema Verde

## Integrante da Equipe

* Filipe Amaral Gomes Waldhelm

## Situação-Problema

Saqua Verde

## Descrição do MVP

O projeto consiste em uma aplicação web/mobile desenvolvida para facilitar o acesso às informações sobre trilhas e regras ambientais da região de Saquarema, promovendo a conscientização ambiental e incentivando práticas sustentáveis.

## Tecnologias Utilizadas

* HTML
* CSS
* JavaScript
* Node.js
* Express
* PWA (Progressive Web App)

## Estrutura do Projeto

* src: código-fonte da aplicação.
* public: interface do sistema.
* data: dados utilizados pela aplicação.
* test: exemplos de uso e testes.

## Como Executar Localmente

1. Instale as dependências:

npm install

2. Execute a aplicação:

node src/server.js

3. Abra no navegador:

http://localhost:3000
>>>>>>> a392381615bc88ab822e090b2026a5bbc3c5ba93
