import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column 
} from 'typeorm';

@Entity('Categoria')
export class CategoriaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id_categoria: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'int', default: 0 })
  ordem_exibicao: number;
}