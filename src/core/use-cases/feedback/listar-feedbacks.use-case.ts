import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from 'src/core/ports/feedback.repository';

@Injectable()
export class ListarFeedbacksUseCase {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}
  async executar() {
    return this.feedbackRepo.listarTodos();
  }
}
