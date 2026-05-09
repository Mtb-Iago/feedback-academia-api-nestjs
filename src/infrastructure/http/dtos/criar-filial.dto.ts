import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CriarFilialDto {
  @ApiProperty({
    example: 'Academia Centro',
    description: 'Nome da filial',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: 'Rua das Flores, 123 - Centro',
    description: 'Endereço completo da filial',
  })
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @ApiProperty({
    example: '(11) 99999-9999',
    description: 'Telefone de contato da filial',
  })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({
    example: 'contato@academia.com',
    description: 'E-mail de contato da filial',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
