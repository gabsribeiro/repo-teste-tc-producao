import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HttpModule } from '@nestjs/axios';
import { PedidoController } from '../controllers/pedido.controller';
import { PEDIDO_SERVICE_TOKEN } from '../services/interfaces/pedido.service.interface';
import { PedidoService } from '../services/pedido.service';
import { PedidoRepository } from '../repositories/pedido.repository';
import { PEDIDO_REPOSITORY_TOKEN } from '../repositories/interfaces/pedido.repository.interface';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controler';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { NotificacaoService } from '../services/notificacao.service';
import { NOTIFICACAO_SERVICE_TOKEN } from '../services/interfaces/notificacao.service.interface';
import { SecretsService } from '../external/secrets.service';
import { SecretsModule } from './secrets.module';

@Module({
  imports: [
    SecretsModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RedisModule.forRootAsync({
      useFactory: async (secretsService: SecretsService) => {
        const redisSecrets = await secretsService.getSecret('db/redis');
        return {
          config: {
            host: redisSecrets.host,
            port: redisSecrets.port,
            password: redisSecrets.password
          }
        };
      },
      inject: [SecretsService],
    }),
    HttpModule,
  ],
  controllers: [
    PedidoController, 
    AuthController
  ],
  providers: [
    {
      provide: PEDIDO_SERVICE_TOKEN,
      useClass: PedidoService,
    },
    {
      provide: NOTIFICACAO_SERVICE_TOKEN,
      useClass: NotificacaoService,
    },
    {
      provide: PEDIDO_REPOSITORY_TOKEN,
      useClass: PedidoRepository,
    },
    AuthService,
    SecretsService,
    JwtStrategy,
  ],
})
export class AppModule {}
