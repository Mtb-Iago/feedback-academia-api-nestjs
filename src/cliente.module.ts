import { Module } from '@nestjs/common';

import { ClienteRepository } from './core/ports/cliente.repository';

import { JsonClienteRepository } from './infrastructure/adapters/database/json/json-cliente.repository';
import { ClienteController } from './infrastructure/http/controllers/cliente.controller';
import { CriarClienteUseCase } from './core/use-cases/feedback/create-cliente.use-case';
import { DeletarClienteUseCase } from './core/use-cases/feedback/deletar-cliente.use-case';
import { ListarClientesUseCase } from './core/use-cases/feedback/listar-cliente.use-case';
import { AtualizarClienteUseCase } from './core/use-cases/feedback/atualizar-cliente.use-case';

@Module({
  controllers: [ClienteController],
  providers: [
    CriarClienteUseCase,
    ListarClientesUseCase,
    DeletarClienteUseCase,
    AtualizarClienteUseCase,
    {
      provide: ClienteRepository,
      useClass: JsonClienteRepository,
    },
  ],
})
export class ClienteModule {}
