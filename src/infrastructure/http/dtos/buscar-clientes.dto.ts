import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class BuscarClientesQueryDto {
  @ApiPropertyOptional({ description: 'Nome do cliente para filtrar', example: 'João' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Email do cliente para filtrar', example: 'joao@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Telefone do cliente para filtrar', example: '(73) 99999-9999' })
  @IsOptional()
  @IsString()
  telefone?: string;
}
