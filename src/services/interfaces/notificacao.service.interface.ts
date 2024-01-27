export const NOTIFICACAO_SERVICE_TOKEN = 'INotificacaoService';

export interface INotificacaoService {
    notificarCriacaoPedido(dadosPedido: any, jwtToken: string): void;
    notificarAtualizacaoPedido(dadosPedido: any, jwtToken: string): void;
}
  
  
  