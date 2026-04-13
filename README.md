# Buscar Preco Portal Compras Gov

API em NestJS para buscar materiais no PNCP e no CNBS e retornar dados que ajudam a localizar precos de produtos usados em processos de licitacao.

O projeto se apoia na API de dados abertos do Compras.gov.br:

https://dadosabertos.compras.gov.br/swagger-ui/index.html

## Objetivo

O objetivo desta aplicacao e facilitar a busca por produtos e materiais quando existe a necessidade de montar uma licitacao, consultando informacoes do PNCP e do CNBS para apoiar a analise de precos.

## Requisitos

- Node.js 22 ou superior
- npm ou yarn
- Docker opcional, apenas se quiser rodar em container

## Rodar sem Docker

### 1. Instalar dependencias

```bash
npm install
```

### 2. Rodar em modo desenvolvimento

```bash
npm run start:dev
```

A aplicacao sobe na porta `3000`.

### 3. Acessar a documentacao

- API: http://localhost:3000
- Swagger: http://localhost:3000/api

### 4. Build para producao

```bash
npm run build
```

### 5. Rodar em producao localmente

```bash
npm run start:prod
```

## Rodar com Docker

### 1. Build da imagem

```bash
docker build -t buscar-preco-portal-compras-gov .
```

### 2. Subir o container

```bash
docker run -p 3000:3000 buscar-preco-portal-compras-gov
```

A aplicacao tambem fica disponivel em:

- API: http://localhost:3000
- Swagger: http://localhost:3000/api

## Estrutura principal

- `src/main.ts`: ponto de entrada da aplicacao
- `src/app.module.ts`: modulo raiz
- `src/busscar_produto/`: regra de busca de materiais e precos

## Endpoints principais

O endpoint principal da aplicacao e:

- `GET /busscar-produto/searchMaterial`

Ele faz a busca completa do material, consultando o CNBS e, quando necessario, os dados abertos do Compras.gov.br para tentar encontrar precos.

Os outros endpoints servem de apoio dentro do service, mas foram expostos para uso mais especifico, caso voce queira consultar diretamente etapas da busca:

- `GET /busscar-produto/searchCodigoPdm`
- `GET /busscar-produto/searchDadosAbertosCompras`

Fluxo suportado pela API:

- busca por material no CNBS
- busca por codigo PDM no CNBS
- busca de dados abertos do Compras.gov.br

## Licenca

sem licenca definida.
