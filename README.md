# Roteiriza

Projeto de planejamento e registro de viagens.

## Etapa 1

A interface foi criada somente com HTML semântico e possui:

- identificação e navegação do sistema;
- formulário para cadastrar uma viagem;
- tabela com viagens fictícias;
- pesquisa, filtro e ordenação previstos;
- área de detalhes com uma imagem de Paris;
- ações de editar e excluir previstas para as próximas etapas.

Os botões e formulários ainda não possuem comportamento em JavaScript.

## Etapa 2 — CSS, Layout e Responsividade

A interface foi evoluída com:

- identidade visual baseada em tons de verde, creme e coral;
- arquivo CSS externo com variáveis, seletores e Box Model;
- layout construído com CSS Grid e Flexbox;
- formulário, tabela, filtros e detalhes organizados em painéis;
- estados de hover e foco visível nos controles;
- tipografia, contraste, espaçamentos e hierarquia visual;
- Media Queries para adaptação em tablets e celulares;
- navegação responsiva sem rolagem horizontal injustificada.

## Etapa 3 — Aplicação interativa

A aplicação agora utiliza JavaScript para:

- cadastrar, editar, visualizar e excluir viagens;
- renderizar a listagem e os detalhes dinamicamente;
- pesquisar por cidade ou país, filtrar por status e ordenar resultados;
- persistir os registros no `localStorage`, inclusive após recarregar a página;
- consultar a API pública [CountriesNow](https://countriesnow.space/) para preencher a moeda do país informado.

O dado retornado pela API complementa o cadastro da viagem e é armazenado junto ao registro no `localStorage`.
