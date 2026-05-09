import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './feedback.module';
import { FilialModule } from './filial.module';

@Module({
  imports: [FeedbackModule, FilialModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
