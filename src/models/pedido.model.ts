import { ApiProperty } from '@nestjs/swagger';
import { ComboDto } from './dtos/combo.model';

export class Pedido {
  @ApiProperty({ example: 122 })
  id: number;

  @ApiProperty({
    example: 'Fulano da Silva' ,
    description: 'Identificador do cliente. Pode ser o nome, CPF ou email.'
  })
  idCliente: string;

  @ApiProperty({ type: () => [ComboDto] })
  combos: ComboDto[];

  @ApiProperty({ example: 23.98 })
  valorTotal: number;

  @ApiProperty({ example: 'PENDENTE' })
  status: string;

  @ApiProperty({ example: true })
  pago: boolean;

  @ApiProperty({ example: '2023-09-01T13:00:00.000+00:00' })
  dataCadastro: Date;

  @ApiProperty({ required: false, example: null })
  dataAlteracao: Date | null;
}
