import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { INotificacaoService } from './interfaces/notificacao.service.interface';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class NotificacaoService implements INotificacaoService {
  constructor(private readonly httpService: HttpService) {}

  notificarCriacaoPedido(dadosPedido: any, jwtToken: string): void {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    this.httpService.post('http://localhost:8080/api/pedido', dadosPedido, config)
      .subscribe({
        next: response => console.log('Pedido criado notificado', response.data),
        error: err => console.error('Erro ao notificar pedido criado', err)
      });
  }

  notificarAtualizacaoPedido(dadosPedido: any, jwtToken: string): void {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${jwtToken}` },
    };
    
    this.httpService.put(`http://localhost:8080/api/pedido/${dadosPedido.id}`, dadosPedido, config)
      .subscribe({
        next: response => console.log('Pedido atualizado notificado', response.data),
        error: err => console.error('Erro ao notificar pedido atualizado', err)
      });
  }
}
