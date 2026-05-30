import { Module } from '@nestjs/common';

import { FeedbackRepository } from './core/ports/feedback.repository';
import { AtualizarFeedbackUseCase } from './core/use-cases/feedback/atualizar-feedback.use-case';
import { CriarFeedbackUseCase } from './core/use-cases/feedback/create-feedback.use-case';
import { DeletarFeedbackUseCase } from './core/use-cases/feedback/deletar-feedback.use-case';
import { ListarFeedbacksUseCase } from './core/use-cases/feedback/listar-feedbacks.use-case';
//import { JsonFeedbackRepository } from './infrastructure/adapters/database/json/json-feedback.repository';
import { FeedbackController } from './infrastructure/http/controllers/feedback.controller';
import { ClienteModule } from './cliente.module';
import { FilialModule } from './filial.module';
import { SqlFeedbackRepository } from './infrastructure/adapters/database/typeorm/sql-feedback.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackOrmEntity } from './infrastructure/adapters/database/typeorm/entities/feedback.orm-entity';
import { RespostaObjetivaOrmEntity } from './infrastructure/adapters/database/typeorm/entities/resposta-objetiva.orm-entity';
import { BuscarFeedbackUseCase } from './core/use-cases/feedback/buscar-feedbacks.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackOrmEntity, RespostaObjetivaOrmEntity]),
    FilialModule,
    ClienteModule,
  ],
  controllers: [FeedbackController],
  providers: [
    CriarFeedbackUseCase,
    ListarFeedbacksUseCase,
    DeletarFeedbackUseCase,
    AtualizarFeedbackUseCase,
    BuscarFeedbackUseCase,
    {
      provide: FeedbackRepository,
      useClass: SqlFeedbackRepository,
    },
  ],
})
export class FeedbackModule {}
