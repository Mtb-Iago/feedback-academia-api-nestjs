import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class RespostaDto {
  @ApiProperty({
    example: 'uuid-pergunta-123',
    description: 'ID da pergunta respondida',
  })
  @IsString()
  @IsNotEmpty()
  perguntaId: string;

  @ApiProperty({
    example: 5,
    description: 'Nota escolhida (1 a 5)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  opcao_escolhida: number;
}

export class CriarFeedbackDto {
  @ApiProperty({
    example: 'uuid-cliente-001',
    description: 'ID do cliente que enviou o feedback',
  })
  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @ApiProperty({
    example: 'uuid-filial-01',
    description: 'ID da filial avaliada',
  })
  @IsString()
  @IsNotEmpty()
  filialId: string;

  @ApiProperty({
    type: [RespostaDto],
    description: 'Lista de respostas objetivas',
  })
  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto dentro do array
  @Type(() => RespostaDto) // Necessário para o class-transformer processar o array
  respostas: RespostaDto[];
}
