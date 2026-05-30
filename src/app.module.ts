import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './feedback.module';
import { ClienteModule } from './cliente.module';
import { CategoriaModule } from './categoria.module';
import { FilialModule } from './filial.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeedbackOrmEntity } from './infrastructure/adapters/database/typeorm/entities/feedback.orm-entity';
import { RespostaObjetivaOrmEntity } from './infrastructure/adapters/database/typeorm/entities/resposta-objetiva.orm-entity';
import { ClienteOrmEntity } from './infrastructure/adapters/database/typeorm/entities/cliente.orm-entity';
import { CategoriaOrmEntity } from './infrastructure/adapters/database/typeorm/entities/categoria.orm-entity';
import { FilialOrmEntity } from './infrastructure/adapters/database/typeorm/entities/filial.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [
          FeedbackOrmEntity,
          RespostaObjetivaOrmEntity,
          ClienteOrmEntity,
          CategoriaOrmEntity,
          FilialOrmEntity,
        ],
        synchronize: true, // APENAS PARA DESENVOLVIMENTO (Cria as tabelas automaticamente)
      }),
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
