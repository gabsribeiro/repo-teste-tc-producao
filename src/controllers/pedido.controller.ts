import { Body, Controller, Post, Get, Param, Put, Delete, Inject, NotFoundException, Patch, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Pedido } from '../models/pedido.model';
import { IPedidoService, PEDIDO_SERVICE_TOKEN } from '../services/interfaces/pedido.service.interface';
import { UpdateStatusDto } from '../models/dtos/update-status.dto';

@ApiTags('pedidos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('pedidos')
export class PedidoController {
  constructor(
    @Inject(PEDIDO_SERVICE_TOKEN) private readonly pedidoService: IPedidoService
  ) {}

  private extractJwtToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }
    return authHeader.split(' ')[1];
  }
  
  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pedido criado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  async createPedido(@Body() pedidoData: Pedido, @Req() req: Request) {
    const jwtToken = this.extractJwtToken(req); 
    await this.pedidoService.createPedido(pedidoData, jwtToken); 
    return { message: 'Pedido criado com sucesso.' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um pedido pelo ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID do pedido' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pedido encontrado.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  async getPedidoById(@Param('id') id: string) {
    const pedido = await this.pedidoService.findById(id);
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    return pedido;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um pedido' })
  @ApiParam({ name: 'id', type: String, description: 'ID do pedido a ser atualizado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pedido atualizado com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async updatePedido(@Param('id') id: string, @Body() pedidoData: Pedido, @Req() req: Request) {
    const jwtToken = this.extractJwtToken(req); 
    await this.pedidoService.updatePedido(id, pedidoData, jwtToken);
    return { message: 'Pedido atualizado com sucesso.' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um pedido' })
  @ApiParam({ name: 'id', type: String, description: 'ID do pedido a ser deletado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pedido deletado com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async deletePedido(@Param('id') id: string) {
    await this.pedidoService.deletePedido(id);
    return { message: 'Pedido deletado com sucesso.' };
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Obter o status de um pedido pelo ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID do pedido' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status do pedido encontrado.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  async getStatus(@Param('id') id: string): Promise<{ status: string }> {
    const pedido = await this.pedidoService.findById(id);
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    return { status: pedido.status };
  }

  @Get('/status/:status')
  @ApiOperation({ summary: 'Obter pedidos por status' })
  @ApiParam({ name: 'status', description: 'Status do pedido' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pedidos encontrados.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Nenhum pedido encontrado.' })
  async findByStatus(@Param('status') status: string): Promise<Pedido[]> {
    const pedidos = await this.pedidoService.findByStatus(status);
    if (pedidos.length === 0) {
      throw new NotFoundException('Nenhum pedido encontrado com este status.');
    }
    return pedidos;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar o status de um pedido' })
  @ApiParam({ name: 'id', type: String, description: 'ID do pedido' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status do pedido atualizado.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req: Request
  ): Promise<any> {
    const jwtToken = this.extractJwtToken(req);
    await this.pedidoService.updateStatus(id, updateStatusDto.status, jwtToken);
    return { message: 'Status do pedido atualizado com sucesso.' };
  }
}
