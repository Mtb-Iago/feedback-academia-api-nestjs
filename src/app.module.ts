import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './feedback.module';
import { ClienteModule } from './cliente.module';
import { CategoriaModule } from './categoria.module';
import { FilialModule } from './filial.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackOrmEntity } from './infrastructure/adapters/database/typeorm/entities/feedback.orm-entity';
import { RespostaObjetivaOrmEntity } from './infrastructure/adapters/database/typeorm/entities/resposta-objetiva.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin_password',
      database: 'feedback_db',
      entities: [FeedbackOrmEntity, RespostaObjetivaOrmEntity],
      synchronize: true, // APENAS PARA DESENVOLVIMENTO (Cria as tabelas automaticamente)
    }),
    FeedbackModule,
    FilialModule,
    CategoriaModule,
    ClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
