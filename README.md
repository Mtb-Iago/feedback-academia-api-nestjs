<<<<<<< HEAD
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
=======
# 📊 API de Gestão de Feedbacks - Arquitetura Hexagonal

Este projeto é um sistema de gestão de feedbacks para clientes e filiais, desenvolvido com **NestJS** utilizando os princípios da **Arquitetura Hexagonal (Ports and Adapters)**. O objetivo principal é manter o núcleo da aplicação (regras de negócio) completamente isolado de tecnologias externas como bancos de dados e protocolos de comunicação.

## 🏗️ Arquitetura do Projeto

A estrutura segue o padrão hexagonal para garantir testabilidade e facilidade de troca de infraestrutura (ex: trocar JSON por PostgreSQL):

* **Core (Domain & Use Cases):** Contém as entidades de negócio e a lógica de aplicação. É independente de frameworks.
* **Ports (Portas):** Interfaces (Classes Abstratas no TypeScript) que definem como o núcleo se comunica com o mundo externo.
* **Adapters (Adaptadores):**
    * **Entrada (Drivers):** Controladores REST (NestJS) que recebem requisições e chamam os Casos de Uso.
    * **Saída (Driven):** Repositórios que implementam a persistência (atualmente em arquivos JSON).

## 📂 Domínios Implementados

1.  **Categoria:** Classificação das perguntas (ex: Limpeza, Atendimento, Preço).
2.  **Filial:** Unidades físicas avaliadas.
3.  **Cliente:** Usuários que fornecem o feedback.
4.  **Feedback:** Composto por perguntas e respostas objetivas (escala de satisfação).

## 🛠️ Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **Linguagem:** TypeScript
* **Documentação:** Swagger (@nestjs/swagger)
* **Validação:** Class-validator & Class-transformer
* **Persistência:** File System (JSON) - *Preparado para migração SQL*

## 🚀 Como Executar

1.  **Instalar dependências:**
    ```bash
    npm install
    ```

2.  **Iniciar em modo de desenvolvimento:**
    ```bash
    npm run start:dev
    ```

3.  **Acessar documentação (Swagger):**
    Abra o navegador em `http://localhost:3000/api`

## 📡 Endpoints (Feedback)

* `POST /feedbacks`: Cria um novo feedback com múltiplas respostas.
* `GET /feedbacks`: Lista todos os feedbacks gravados no arquivo JSON.
* `PATCH /feedbacks/:id`: Atualiza dados ou respostas de um feedback existente.
* `DELETE /feedbacks/:id`: Remove um registro de feedback.

## 📊 Métricas e Queries Planejadas (SQL)

O sistema foi desenhado para suportar as seguintes métricas analíticas assim que a migração para banco relacional for concluída:

1.  **Aspecto de maior insatisfação:** Média de notas por categoria no ano anterior.
2.  **Índice médio por filial:** Satisfação dos últimos 6 meses.
3.  **Melhor Filial:** Filial com maior média no último mês.
4.  **Status de Feedbacks:** Distribuição quantitativa de status na última semana.
5.  **Média Global:** Avaliação por categoria em todas as épocas.

## 🏗️ Estrutura de Pastas

```text
src/
├── core/                         # Núcleo da aplicação
│   ├── domain/                   # Entidades (Categoria, Filial, Cliente, Feedback)
│   ├── ports/                    # Classes Abstratas (Contratos de Repositório)
│   └── use-cases/                # Lógica de negócio (SRP - Single Responsibility)
├── infrastructure/               # Detalhes técnicos
│   ├── adapters/                 # Implementações de DB (JSON)
│   ├── http/                     # Controladores e DTOs (Swagger/Validation)
│   └── framework/                # Módulos NestJS e configurações
└── main.ts                       # Bootstrap da aplicação
>>>>>>> origin/main
