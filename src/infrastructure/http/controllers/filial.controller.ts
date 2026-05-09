import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// Casos de Uso
import { CriarFilialUseCase } from '../../../core/use-cases/filial/create-filial.use-case';
import { ListarFiliaisUseCase } from '../../../core/use-cases/filial/listar-filiais.use-case';
import { AtualizarFilialUseCase } from '../../../core/use-cases/filial/atualizar-filial.use-case';
import { DeletarFilialUseCase } from '../../../core/use-cases/filial/deletar-filial.use-case';

// DTOs
import { CriarFilialDto } from '../dtos/criar-filial.dto';
import { AtualizarFilialDto } from '../dtos/atualizar-filial.dto';

// Entidade de Domínio
import { Filial } from '../../../core/domain/filial.entity';

@ApiTags('filiais')
@Controller('filiais')
export class FilialController {
  constructor(
    private readonly criarUC: CriarFilialUseCase,
    private readonly listarUC: ListarFiliaisUseCase,
    private readonly atualizarUC: AtualizarFilialUseCase,
    private readonly deletarUC: DeletarFilialUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova filial' })
  @ApiResponse({ status: 201, description: 'Filial criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CriarFilialDto) {
    return await this.criarUC.executar({
      nome: dto.nome,
      endereco: dto.endereco,
      telefone: dto.telefone,
      email: dto.email,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as filiais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de filiais retornada com sucesso.',
  })
  async listar() {
    return await this.listarUC.executar();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma filial existente' })
  @ApiParam({ name: 'id', description: 'ID da filial', type: 'integer' })
  @ApiResponse({ status: 200, description: 'Filial atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Filial não encontrada.' })
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarFilialDto,
  ) {
    const dadosParaAtualizar: Partial<Filial> = {};

    if (dto.nome !== undefined) dadosParaAtualizar.nome = dto.nome;
    if (dto.endereco !== undefined) dadosParaAtualizar.endereco = dto.endereco;
    if (dto.telefone !== undefined) dadosParaAtualizar.telefone = dto.telefone;
    if (dto.email !== undefined) dadosParaAtualizar.email = dto.email;

    return await this.atualizarUC.executar(id, dadosParaAtualizar);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma filial' })
  @ApiParam({
    name: 'id',
    description: 'ID da filial a ser deletada',
    type: 'integer',
  })
  @ApiResponse({ status: 204, description: 'Filial removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Filial não encontrada.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.deletarUC.executar(id);
  }
}
