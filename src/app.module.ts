import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './feedback.module';
import { CategoriaModule } from './categoria.module'; 

@Module({
  imports: [
    FeedbackModule, 
    CategoriaModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}