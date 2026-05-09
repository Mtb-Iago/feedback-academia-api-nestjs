import { PartialType } from '@nestjs/swagger';
import { CriarFilialDto } from './criar-filial.dto';

export class AtualizarFilialDto extends PartialType(CriarFilialDto) {}
