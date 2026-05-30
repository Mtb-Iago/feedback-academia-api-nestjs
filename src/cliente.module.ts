import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClienteRepository } from './core/ports/cliente.repository';

import { ClienteController } from './infrastructure/http/controllers/cliente.controller';
import { CriarClienteUseCase } from './core/use-cases/cliente/create-cliente.use-case';
import { DeletarClienteUseCase } from './core/use-cases/cliente/deletar-cliente.use-case';
import { ListarClientesUseCase } from './core/use-cases/cliente/listar-cliente.use-case';
import { AtualizarClienteUseCase } from './core/use-cases/cliente/atualizar-cliente.use-case';
import { BuscarClientesUseCase } from './core/use-cases/cliente/buscar-clientes.use-case';
import { BuscarClientePorIdUseCase } from './core/use-cases/cliente/buscar-cliente-por-id.use-case';
import { SqlClienteRepository } from './infrastructure/adapters/database/typeorm/sql-cliente.repository';
import { ClienteOrmEntity } from './infrastructure/adapters/database/typeorm/entities/cliente.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteOrmEntity])],
  controllers: [ClienteController],
  providers: [
    CriarClienteUseCase,
    ListarClientesUseCase,
    DeletarClienteUseCase,
    AtualizarClienteUseCase,
    BuscarClientesUseCase,
    BuscarClientePorIdUseCase,
    {
      provide: ClienteRepository,
      useClass: SqlClienteRepository,
    },
  ],
  exports: [ClienteRepository],
})
export class ClienteModule {}
