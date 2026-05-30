import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// Use Cases
import { CriarClienteUseCase } from 'src/core/use-cases/cliente/create-cliente.use-case';
import { DeletarClienteUseCase } from 'src/core/use-cases/cliente/deletar-cliente.use-case';
import { ListarClientesUseCase } from 'src/core/use-cases/cliente/listar-cliente.use-case';
import { AtualizarClienteUseCase } from 'src/core/use-cases/cliente/atualizar-cliente.use-case';
import { BuscarClientesUseCase } from 'src/core/use-cases/cliente/buscar-clientes.use-case';
import { BuscarClientePorIdUseCase } from 'src/core/use-cases/cliente/buscar-cliente-por-id.use-case';

// DTOs
import { CriarClienteDto } from '../dtos/criar-cliente.dto';
import { AtualizarClienteDto } from '../dtos/atualizar-cliente.dto';
import { BuscarClientesQueryDto } from '../dtos/buscar-clientes.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly criarUC: CriarClienteUseCase,
    private readonly listarUC: ListarClientesUseCase,
    private readonly deletarUC: DeletarClienteUseCase,
    private readonly atualizarUC: AtualizarClienteUseCase,
    private readonly buscarUC: BuscarClientesUseCase,
    private readonly buscarPorIdUC: BuscarClientePorIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CriarClienteDto) {
    return await this.criarUC.executar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ou buscar clientes com filtros opcionais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso.',
  })
  async listar(@Query() query: BuscarClientesQueryDto) {
    const temFiltros = query.nome || query.email || query.telefone;
    if (temFiltros) {
      return await this.buscarUC.executar(query);
    }
    return await this.listarUC.executar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async buscarPorId(@Param('id') id: string) {
    return await this.buscarPorIdUC.executar(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente existente' })
  @ApiParam({ name: 'id', description: 'ID do cliente', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async atualizar(@Param('id') id: string, @Body() dto: AtualizarClienteDto) {
    return await this.atualizarUC.executar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente a ser deletado',
    type: 'string',
  })
  @ApiResponse({ status: 204, description: 'Cliente removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    await this.deletarUC.executar(id);
  }
}
