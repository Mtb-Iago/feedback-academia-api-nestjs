import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class BuscarFilialFiltroDto {
  @ApiPropertyOptional({
    example: 'Academia Centro',
    description: 'Nome ou parte do nome da filial para filtro',
  })
  @IsString()
  @IsOptional()
  nome?: string;
}
