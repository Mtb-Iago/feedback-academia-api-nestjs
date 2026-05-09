import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FeedbackRepository } from '../../../../core/ports/feedback.repository';
import { Feedback } from '../../../../core/domain/feedback/feedback.entity';

@Injectable()
export class JsonFeedbackRepository implements FeedbackRepository {
  private readonly filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'data',
    'feedbacks.json',
  );

  private async lerArquivo(): Promise<Feedback[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async escreverArquivo(dados: Feedback[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(dados, null, 2), 'utf-8');
  }

  async salvar(feedback: Feedback): Promise<void> {
    const feedbacks = await this.lerArquivo();
    feedbacks.push(feedback);
    await this.escreverArquivo(feedbacks);
  }

  async buscarPorId(id: string): Promise<Feedback | null> {
    const feedbacks = await this.lerArquivo();
    return feedbacks.find((f) => f.id_feedback === id) || null;
  }

  async listarRecentes(meses: number): Promise<Feedback[]> {
    const feedbacks = await this.lerArquivo();
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() - meses);

    return feedbacks.filter((f) => new Date(f.data_criacao) >= dataLimite);
  }

  async listarTodos(): Promise<Feedback[]> {
    return await this.lerArquivo();
  }

  async atualizar(id: string, dados: Partial<Feedback>): Promise<Feedback> {
    const feedbacks = await this.lerArquivo();
    const index = feedbacks.findIndex((f) => f.id_feedback === id);

    if (index === -1) throw new Error('Feedback não encontrado');

    feedbacks[index] = { ...feedbacks[index], ...dados };
    await this.escreverArquivo(feedbacks);
    return feedbacks[index];
  }

  async deletar(id: string): Promise<void> {
    const feedbacks = await this.lerArquivo();
    const filtrados = feedbacks.filter((f) => f.id_feedback !== id);
    await this.escreverArquivo(filtrados);
  }
}
