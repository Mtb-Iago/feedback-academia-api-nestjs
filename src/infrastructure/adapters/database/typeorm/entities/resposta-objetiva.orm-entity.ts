import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FeedbackOrmEntity } from './feedback.orm-entity';

@Entity('Resposta_Objetiva')
export class RespostaObjetivaOrmEntity {
  @PrimaryColumn('uuid')
  id_resposta: string;

  @Column('uuid')
  perguntaId: string;

  @Column('int')
  opcao_escolhida: number;

  @ManyToOne(() => FeedbackOrmEntity, (feedback) => feedback.respostas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_feedback' })
  feedback: FeedbackOrmEntity;
}
