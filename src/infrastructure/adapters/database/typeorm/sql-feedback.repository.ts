import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FeedbackRepository } from '../../../../core/ports/feedback.repository';
import { Feedback } from '../../../../core/domain/feedback/feedback.entity';
import { RespostaObjetiva } from '../../../../core/domain/feedback/resposta-objetiva.entity';
import { FeedbackOrmEntity } from './entities/feedback.orm-entity';

@Injectable()
export class SqlFeedbackRepository implements FeedbackRepository {
  constructor(
    @InjectRepository(FeedbackOrmEntity)
    private readonly repo: Repository<FeedbackOrmEntity>,
  ) {}

  // Função auxiliar para converter do BD para o Domínio
  private toDomain(ormEntity: FeedbackOrmEntity): Feedback {
    const respostas =
      ormEntity.respostas?.map(
        (r) =>
          new RespostaObjetiva(r.id_resposta, r.perguntaId, r.opcao_escolhida),
      ) || [];

    return new Feedback(
      ormEntity.id_feedback,
      ormEntity.clienteId,
      ormEntity.filialId,
      ormEntity.status_feedback,
      ormEntity.data_criacao,
      respostas,
    );
  }

  async salvar(feedback: Feedback): Promise<void> {
    const entity = this.repo.create(feedback);
    await this.repo.save(entity);
  }

  async buscarPorId(id: string): Promise<Feedback | null> {
    const ormEntity = await this.repo.findOne({ where: { id_feedback: id } });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async listarTodos(): Promise<Feedback[] | []> {
    return await this.repo.find();
  }

  async atualizar(id: string, dados: Partial<Feedback>): Promise<Feedback> {
    const feedbackExistente = await this.repo.findOne({
      where: { id_feedback: id },
    });
    if (!feedbackExistente) throw new Error('Feedback não encontrado');

    const feedbackAtualizado = this.repo.merge(feedbackExistente, dados);
    await this.repo.save(feedbackAtualizado);

    return this.toDomain(feedbackAtualizado);
  }

  async deletar(id: string): Promise<void> {
    await this.repo.delete({ id_feedback: id });
  }

  async buscarPorFiltros(filtros: {
    clienteId?: string;
    filialId?: string;
    status?: string;
  }): Promise<Feedback[]> {
    const conditions: FindOptionsWhere<FeedbackOrmEntity> = {};

    if (filtros.clienteId) {
      conditions.clienteId = filtros.clienteId;
    }

    if (filtros.filialId) {
      conditions.filialId = filtros.filialId;
    }

    if (filtros.status) {
      conditions.status_feedback = filtros.status;
    }

    const ormEntities = await this.repo.find({ where: conditions });
    return ormEntities.map((entity) => this.toDomain(entity));
  }
}
