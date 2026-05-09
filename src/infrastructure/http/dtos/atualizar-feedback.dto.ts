import { PartialType } from '@nestjs/swagger';
import { CriarFeedbackDto } from './criar-feedback.dto';

export class AtualizarFeedbackDto extends PartialType(CriarFeedbackDto) {}
