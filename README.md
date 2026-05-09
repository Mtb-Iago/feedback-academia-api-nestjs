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

1.  **Categoria:** Classificação das perguntas (ex: Limpeza, Atendimento, Preço). **CRUD completo implementado.**
2.  **Filial:** Unidades físicas avaliadas. **CRUD completo implementado.**
3.  **Cliente:** Usuários que fornecem o feedback.
4.  **Feedback:** Composto por perguntas e respostas objetivas (escala de satisfação).

## 🛠️ Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **Linguagem:** TypeScript
* **Documentação:** Swagger (@nestjs/swagger)
* **Validação:** Class-validator & Class-transformer
* **Persistência:** File System (JSON) - *Preparado para migração SQL*
* **Testes:** Jest + @nestjs/testing

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

## 📡 Endpoints

### Categoria

* `POST /categorias`: Cria uma nova categoria. O `id_categoria` (Int) é gerado automaticamente pelo repositório.
* `GET /categorias`: Lista todas as categorias cadastradas.
* `PATCH /categorias/:id`: Atualização parcial dos campos de uma categoria.
* `DELETE /categorias/:id`: Remove uma categoria pelo id numérico.

**Modelo de Categoria** (espelha a tabela `CATEGORIA` do diagrama ER):

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id_categoria` | `number` | PK, gerado pelo repositório (TINYINT) |
| `nome` | `string` | Nome da categoria (Máx 50 chars) |
| `descricao` | `string` | Descrição detalhada da categoria |
| `ordem_exibicao` | `number` | Ordem em que a categoria será listada na UI |

### Feedback

* `POST /feedbacks`: Cria um novo feedback com múltiplas respostas. **Valida se o `filialId` informado existe** antes de gravar (lança `404 Not Found` caso contrário).
* `GET /feedbacks`: Lista todos os feedbacks gravados no arquivo JSON.
* `PATCH /feedbacks/:id`: Atualiza dados ou respostas de um feedback existente.
* `DELETE /feedbacks/:id`: Remove um registro de feedback.

### Filial

* `POST /filiais`: Cria uma nova filial. O `id_filial` (Int) é gerado automaticamente pelo repositório (autoincrement com base no maior id existente).
* `GET /filiais`: Lista todas as filiais cadastradas.
* `PATCH /filiais/:id`: Atualização parcial dos campos de uma filial. O `id_filial` é protegido contra sobrescrita.
* `DELETE /filiais/:id`: Remove uma filial pelo id.

**Modelo de Filial** (espelha a tabela `FILIAIS` do diagrama ER):

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id_filial` | `number` | PK, gerado pelo repositório |
| `nome` | `string` | Nome da filial |
| `endereco` | `string` | Endereço completo |
| `telefone` | `string` | Telefone de contato |
| `email` | `string` | E-mail de contato (validado por `@IsEmail`) |

## 🔗 Integração entre Módulos

O módulo de **Feedback** depende do módulo de **Filial** para validar a existência da filial referenciada ao criar um feedback. Essa integração é feita via **injeção de dependência** seguindo o padrão hexagonal:

* `FilialModule` exporta o token `FilialRepository`.
* `FeedbackModule` importa `FilialModule`, ganhando acesso ao provider exportado.
* `CriarFeedbackUseCase` recebe o `FilialRepository` no construtor e consulta `buscarPorId` antes de persistir o feedback. Se a filial não existir, lança `NotFoundException`.

Como o `filialId` no Feedback é `string` e o `id_filial` na Filial é `number` (conforme o diagrama), a conversão é feita pontualmente no use-case via `Number(dados.filialId)`.

## 🧪 Testes

Suíte unitária completa para todos os use-cases de **Filial**, escrita com **Jest** + `@nestjs/testing` (mock injetado via `useValue` no token da porta abstrata).

| Use-case | Arquivo de teste | Cenários cobertos |
| :--- | :--- | :--- |
| `CriarFilialUseCase` | `create-filial.use-case.spec.ts` | sucesso, propagação de erros, instância de `Filial`, placeholder de id, múltiplas execuções |
| `ListarFiliaisUseCase` | `listar-filiais.use-case.spec.ts` | retorno da lista, lista vazia, propagação de erros |
| `AtualizarFilialUseCase` | `atualizar-filial.use-case.spec.ts` | sucesso, ordem `buscarPorId → atualizar`, atualização parcial, `NotFoundException`, propagação de erros |
| `DeletarFilialUseCase` | `deletar-filial.use-case.spec.ts` | sucesso, ordem das chamadas, `NotFoundException`, não-execução do delete em caso de erro, propagação de erros |

**Comandos:**

```bash
# Roda toda a suíte
npm test

# Apenas os testes de filial
npm test -- filial

# Cobertura
npm run test:cov

## 📊 Métricas e Queries Planejadas (SQL)

O sistema foi desenhado para suportar as seguintes métricas analíticas assim que a migração para banco relacional for concluída:

1.  **Aspecto de maior insatisfação:** Média de notas por categoria no ano anterior.
2.  **Índice médio por filial:** Satisfação dos últimos 6 meses.
3.  **Melhor Filial:** Filial com maior média no último mês.
4.  **Status de Feedbacks:** Distribuição quantitativa de status na última semana.
5.  **Média Global:** Avaliação por categoria em todas as épocas.

## 🏗️ Estrutura de Pastas

src/
├── core/                                       # Núcleo da aplicação
│   ├── domain/                                 # Entidades de negócio
│   │   ├── categoria.entity.ts                 # ← entidade Categoria
│   │   ├── cliente.entity.ts
│   │   ├── filial.entity.ts                    # ← entidade Filial (diagrama ER)
│   │   └── feedback/
│   │       ├── feedback.entity.ts
│   │       ├── pergunta.entity.ts
│   │       └── resposta-objetiva.entity.ts
│   ├── ports/                                  # Contratos (classes abstratas)
│   │   ├── categoria.repository.ts             # ← porta da Categoria
│   │   ├── feedback.repository.ts
│   │   └── filial.repository.ts                # ← porta da Filial
│   └── use-cases/                              # Lógica de negócio
│       ├── categoria/                          # ← use-cases da Categoria
│       │   ├── criar-categoria.use-case.ts
│       │   ├── listar-categorias.use-case.ts
│       │   ├── atualizar-categoria.use-case.ts
│       │   └── deletar-categoria.use-case.ts
│       ├── feedback/
│       │   ├── create-feedback.use-case.ts     # ← injeta FilialRepository
│       │   ├── listar-feedbacks.use-case.ts
│       │   ├── atualizar-feedback.use-case.ts
│       │   └── deletar-feedback.use-case.ts
│       └── filial/
│           ├── create-filial.use-case.ts
│           ├── create-filial.use-case.spec.ts
│           ├── listar-filiais.use-case.ts
│           ├── listar-filiais.use-case.spec.ts
│           ├── atualizar-filial.use-case.ts
│           ├── atualizar-filial.use-case.spec.ts
│           ├── deletar-filial.use-case.ts
│           └── deletar-filial.use-case.spec.ts
├── infrastructure/                             # Detalhes técnicos
│   ├── adapters/database/json/                 # Persistência JSON
│   │   ├── json-categoria.repository.ts        # ← adapter JSON da Categoria
│   │   ├── json-feedback.repository.ts
│   │   └── json-filial.repository.ts           # ← adapter JSON da Filial
│   └── http/
│       ├── controllers/
│       │   ├── categoria.controller.ts         # ← rotas REST de Categoria
│       │   ├── feedback.controller.ts
│       │   └── filial.controller.ts            # ← rotas REST de Filial
│       └── dtos/
│           ├── criar-categoria.dto.ts          # ← validações de Categoria
│           ├── atualizar-categoria.dto.ts
│           ├── criar-feedback.dto.ts
│           ├── atualizar-feedback.dto.ts
│           ├── criar-filial.dto.ts             # ← validações (IsString/IsEmail)
│           └── atualizar-filial.dto.ts
├── categoria.module.ts                         # ← registra dependências da Categoria
├── feedback.module.ts                          # ← importa FilialModule
├── filial.module.ts                            # ← exporta FilialRepository
├── app.module.ts                               # ← registra FilialModule e CategoriaModule
└── main.ts                                     # Bootstrap da aplicação

data/
├── categorias.json                             # ← persistência de Categoria
├── feedbacks.json
└── filiais.json                                # ← persistência de Filial

## 🗒️ Changelog Recente

* **CRUD de Categoria** implementado seguindo a arquitetura hexagonal (entidade, porta, 4 use-cases, adapter JSON, DTOs com validação, controller, módulo Nest).
* **CRUD de Filial** implementado (entidade, porta, 4 use-cases, adapter JSON, DTOs com validação, controller, módulo Nest).
* **Validação de existência de filial** ao criar feedback, via injeção de dependência (`FilialRepository` no `CriarFeedbackUseCase`).
* **Suíte de testes unitários** completa para os 4 use-cases de filial (~44 testes no total).
* **Persistência JSON** da filial em `data/filiais.json` e categorias em `data/categorias.json` com auto-incremento de ID.