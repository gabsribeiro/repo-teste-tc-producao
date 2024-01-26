// src/repositories/pedido.repository.ts

import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Pedido } from '../models/pedido.model';
import { IPedidoRepository } from './interfaces/pedido.repository.interface';

@Injectable()
export class PedidoRepository implements IPedidoRepository {
  constructor(private readonly redisService: RedisService) {}

  async savePedido(pedidoData: Pedido): Promise<Pedido> {
    const client = this.redisService.getClient();
    await client.set(`pedido:${pedidoData.id}`, JSON.stringify(pedidoData));
    await client.sadd(`status:${pedidoData.status}`, pedidoData.id);
    return pedidoData;
  }
  
  async findById(id: string): Promise<Pedido> {
    const client = this.redisService.getClient();
    const data = await client.get(`pedido:${id}`);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  async updatePedido(id: string, pedidoData: Pedido): Promise<Pedido> {
    const client = this.redisService.getClient();
    const currentData = await client.get(`pedido:${id}`);
    if (currentData) {
      const currentPedido = JSON.parse(currentData);
      await client.srem(`status:${currentPedido.status}`, id);
    }
  

    await client.set(`pedido:${id}`, JSON.stringify(pedidoData));
    await client.sadd(`status:${pedidoData.status}`, id);
  
    return pedidoData;
  }

  async deletePedido(id: string): Promise<void> {
    const client = this.redisService.getClient();
    await client.del(`pedido:${id}`);
  }

  async findByStatus(status: string): Promise<Pedido[]> {
    const client = this.redisService.getClient();
    const pedidoIds = await client.smembers(`status:${status}`);
    const pedidos = [];
  
    for (const id of pedidoIds) {
      const data = await client.get(`pedido:${id}`);
      if (data) {
        pedidos.push(JSON.parse(data));
      }
    }
  
    return pedidos;
  }
  
}
