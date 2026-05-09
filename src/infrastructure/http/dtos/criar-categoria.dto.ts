import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarCategoriaDto {
  @ApiProperty({ example: 'Dados Pessoais', description: 'O nome da categoria' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nome!: string;

  @ApiProperty({
    example: 'Informações sensíveis e de identificação.',
    description: 'A descrição da categoria',
  })
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty({ example: 1, description: 'A ordem em que a categoria deve ser exibida' })
  @IsNumber()
  @IsNotEmpty()
  ordem_exibicao!: number;
}