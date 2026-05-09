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