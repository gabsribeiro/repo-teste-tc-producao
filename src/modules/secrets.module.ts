import { Module, Global } from '@nestjs/common';
import { SecretsService } from '../external/secrets.service';

@Global()
@Module({
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}
