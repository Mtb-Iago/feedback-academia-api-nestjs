import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// Casos de Uso
import { ListarCategoriasUseCase } from '../../../core/use-cases/categoria/listar-categorias.use-case';
import { DeletarCategoriaUseCase } from '../../../core/use-cases/categoria/deletar-categoria.use-case';
import { AtualizarCategoriaUseCase } from '../../../core/use-cases/categoria/atualizar-categoria.use-case';
import { CriarCategoriaUseCase } from '../../../core/use-cases/categoria/criar-categoria.use-case';

// DTOs
import { CriarCategoriaDto } from '../dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from '../dtos/atualizar-categoria.dto';

// Entidades de Domínio
import { Categoria } from '../../../core/domain/categoria.entity';

@ApiTags('categorias') // Agrupa todos os endpoints deste controller no Swagger
@Controller('categorias')
export class CategoriaController {
  constructor(
    private readonly criarUC: CriarCategoriaUseCase,
    private readonly listarUC: ListarCategoriasUseCase,
    private readonly atualizarUC: AtualizarCategoriaUseCase,
    private readonly deletarUC: DeletarCategoriaUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar uma nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CriarCategoriaDto) {
    const dadosMapeados = {
      nome: dto.nome,
      descricao: dto.descricao,
      ordem_exibicao: dto.ordem_exibicao,
    };

    return await this.criarUC.executar(dadosMapeados);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso.',
  })
  async listar() {
    return await this.listarUC.executar();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma categoria existente' })
  @ApiParam({ name: 'id', description: 'ID da categoria', type: 'number' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  async atualizar(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: AtualizarCategoriaDto,
  ) {
    const dadosParaAtualizar: Partial<Categoria> = {};

    if (dto.nome !== undefined) {
      dadosParaAtualizar.nome = dto.nome;
    }

    if (dto.descricao !== undefined) {
      dadosParaAtualizar.descricao = dto.descricao;
    }

    if (dto.ordem_exibicao !== undefined) {
      dadosParaAtualizar.ordem_exibicao = dto.ordem_exibicao;
    }

    return await this.atualizarUC.executar(id, dadosParaAtualizar);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria a ser deletada',
    type: 'number',
  })
  @ApiResponse({ status: 204, description: 'Categoria removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.deletarUC.executar(id);
  }
}