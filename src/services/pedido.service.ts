// src/services/pedido.service.ts

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IPedidoService } from './interfaces/pedido.service.interface';
import { Pedido } from '../models/pedido.model';
import { IPedidoRepository, PEDIDO_REPOSITORY_TOKEN } from '../repositories/interfaces/pedido.repository.interface';
import { INotificacaoService, NOTIFICACAO_SERVICE_TOKEN } from './interfaces/notificacao.service.interface';

@Injectable()
export class PedidoService implements IPedidoService {
  constructor(
    @Inject(PEDIDO_REPOSITORY_TOKEN) private readonly pedidoRepository: IPedidoRepository,
    @Inject(NOTIFICACAO_SERVICE_TOKEN) private readonly notificacaoService: INotificacaoService
  ) {}

  async createPedido(pedidoData: Pedido, jwtToken: string): Promise<Pedido> {
    const existingPedido = await this.pedidoRepository.findById(pedidoData.id.toString());
    if (existingPedido) {
      throw new ConflictException(`Um pedido com o ID ${pedidoData.id} já existe.`);
    }
    const createdPedido =  this.pedidoRepository.savePedido(pedidoData);
    
    //? Por enquanto não será usado, preciso rever essa logica de negocio.
    // this.notificacaoService.notificarCriacaoPedido(createdPedido, jwtToken);

    return createdPedido;
  }

  async findById(id: string): Promise<Pedido> {
    return this.pedidoRepository.findById(id);
  }

  async updatePedido(id: string, pedidoData: Pedido, jwtToken: string): Promise<Pedido> {
    const updatedPedido = await this.pedidoRepository.updatePedido(id, pedidoData);
    //? Por enquanto não será usado, preciso rever essa logica de negocio.
    // this.notificacaoService.notificarAtualizacaoPedido(updatedPedido, jwtToken);
    return updatedPedido
  }

  async deletePedido(id: string): Promise<void> {
    return this.pedidoRepository.deletePedido(id);
  }

  async updateStatus(id: string, status: string, jwtToken: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado.');
    }
    pedido.status = status;
    return this.updatePedido(id, pedido, jwtToken);
  }

  async findByStatus(status: string): Promise<Pedido[]> {
    return this.pedidoRepository.findByStatus(status);
  }

}
