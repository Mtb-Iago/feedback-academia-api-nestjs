import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BuscarFeedbacksQueryDto {
  @ApiPropertyOptional({ description: 'ID do cliente para filtrar' })
  @IsOptional()
  @IsString()
  clienteId?: string;

  @ApiPropertyOptional({ description: 'ID da filial para filtrar' })
  @IsOptional()
  @IsString()
  filialId?: string;

  @ApiPropertyOptional({
    description: 'Status do feedback (ex: ABERTO, FECHADO)',
    example: 'ABERTO',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
