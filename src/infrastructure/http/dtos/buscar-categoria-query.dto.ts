import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BuscarCategoriaQueryDto {
  @ApiPropertyOptional({ 
    description: 'Nome da categoria para filtrar',
    example: 'Eletrônicos'
  })
  @IsOptional()
  @IsString()
  nome?: string;
}