// src/repositories/interfaces/pedido.repository.interface.ts

import { Pedido } from '../../models/pedido.model';

export const PEDIDO_REPOSITORY_TOKEN = 'IPedidoRepository';

export interface IPedidoRepository {
  savePedido(pedidoData: Pedido): Promise<Pedido>;
  findById(id: string): Promise<Pedido>;
  updatePedido(id: string, pedidoData: Pedido): Promise<Pedido>;
  deletePedido(id: string): Promise<void>;
  findByStatus(status: string): Promise<Pedido[]>;
}
