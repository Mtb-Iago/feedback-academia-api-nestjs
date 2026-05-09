import { Module } from '@nestjs/common';
import { FilialRepository } from './core/ports/filial.repository';
import { CriarFilialUseCase } from './core/use-cases/filial/create-filial.use-case';
import { ListarFiliaisUseCase } from './core/use-cases/filial/listar-filiais.use-case';
import { AtualizarFilialUseCase } from './core/use-cases/filial/atualizar-filial.use-case';
import { DeletarFilialUseCase } from './core/use-cases/filial/deletar-filial.use-case';
import { JsonFilialRepository } from './infrastructure/adapters/database/json/json-filial.repository';
import { FilialController } from './infrastructure/http/controllers/filial.controller';

@Module({
  controllers: [FilialController],
  providers: [
    CriarFilialUseCase,
    ListarFiliaisUseCase,
    AtualizarFilialUseCase,
    DeletarFilialUseCase,
    {
      provide: FilialRepository,
      useClass: JsonFilialRepository,
    },
  ],
  exports: [FilialRepository],
})
export class FilialModule {}
