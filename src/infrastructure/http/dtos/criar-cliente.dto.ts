import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEmail } from 'class-validator';

export class CriarClienteDto {
  @ApiProperty({
    example: 'uuid-cliente-001',
    description: 'ID do cliente',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'João Vitor',
    description: 'Nome do cliente',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: '2024-10-24',
    description: 'Data de cadastro do cliente',
  })
  @IsDateString()
  @IsNotEmpty()
  data_cadastro: Date;

  @ApiProperty({
    example: '(73) 99999-9999',
    description: 'Telefone do cliente',
  })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do cliente',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
