import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('Cliente')
export class ClienteOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @Column({ type: 'varchar', length: 20 })
  telefone: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;
}
