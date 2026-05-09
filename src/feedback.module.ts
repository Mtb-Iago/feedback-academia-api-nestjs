import { Module } from '@nestjs/common';
import { FeedbackRepository } from './core/ports/feedback.repository';
import { AtualizarFeedbackUseCase } from './core/use-cases/feedback/atualizar-feedback.use-case';
import { CriarFeedbackUseCase } from './core/use-cases/feedback/create-feedback.use-case';
import { DeletarFeedbackUseCase } from './core/use-cases/feedback/deletar-feedback.use-case';
import { ListarFeedbacksUseCase } from './core/use-cases/feedback/listar-feedbacks.use-case';
import { JsonFeedbackRepository } from './infrastructure/adapters/database/json/json-feedback.repository';
import { FeedbackController } from './infrastructure/http/controllers/feedback.controller';

@Module({
  controllers: [FeedbackController],
  providers: [
    CriarFeedbackUseCase,
    ListarFeedbacksUseCase,
    DeletarFeedbackUseCase,
    AtualizarFeedbackUseCase,
    {
      provide: FeedbackRepository,
      useClass: JsonFeedbackRepository,
    },
  ],
})
export class FeedbackModule {}
