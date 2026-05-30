import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RespostaObjetivaOrmEntity } from './resposta-objetiva.orm-entity';

@Entity('Feedback')
export class FeedbackOrmEntity {
  @PrimaryColumn('uuid')
  id_feedback: string;

  @Column('uuid')
  clienteId: string;

  @Column('uuid')
  filialId: string;

  @Column({ type: 'varchar', length: 50, default: 'ABERTO' })
  status_feedback: string;

  @CreateDateColumn()
  data_criacao: Date;

  @OneToMany(() => RespostaObjetivaOrmEntity, (resposta) => resposta.feedback, {
    cascade: true,
    eager: true,
  })
  respostas: RespostaObjetivaOrmEntity[];
}
