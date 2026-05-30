import { Module } from '@nestjs/common';

// Controller
import { CategoriaController } from './infrastructure/http/controllers/categoria.controller';

// Casos de Uso
import { CriarCategoriaUseCase } from './core/use-cases/categoria/criar-categoria.use-case';
import { ListarCategoriasUseCase } from './core/use-cases/categoria/listar-categorias.use-case';
import { AtualizarCategoriaUseCase } from './core/use-cases/categoria/atualizar-categoria.use-case';
import { DeletarCategoriaUseCase } from './core/use-cases/categoria/deletar-categoria.use-case';

// Port (Interface) e Adapter (Implementação)
import { CategoriaRepository } from './core/ports/categoria.repository';
// import { JsonCategoriaRepository } from './infrastructure/adapters/database/json/json-categoria.repository';
// import { SqlFeedbackRepository } from './infrastructure/adapters/database/typeorm/sql-feedback.repository';
import { CategoriaOrmEntity } from './infrastructure/adapters/database/typeorm/entities/categoria.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuscarCategoriaUseCase } from './core/use-cases/categoria/buscar-categoria.use-case';
import { SqlCategoriaRepository } from './infrastructure/adapters/database/typeorm/sql-categoria.repository';

@Module({
  imports: [
      TypeOrmModule.forFeature([CategoriaOrmEntity]),
      CategoriaModule,
  ],
  controllers: [CategoriaController],
  providers: [
    // Registrando os Casos de Uso
    CriarCategoriaUseCase,
    ListarCategoriasUseCase,
    AtualizarCategoriaUseCase,
    DeletarCategoriaUseCase,
    BuscarCategoriaUseCase,

    {
      provide: CategoriaRepository,
      useClass: SqlCategoriaRepository,
    },
  ],
})
export class CategoriaModule {}
