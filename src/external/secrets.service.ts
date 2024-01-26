import { Injectable } from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';

@Injectable()
export class SecretsService {
  private readonly secretsManager: SecretsManager;
  
  constructor() {
    this.secretsManager = new SecretsManager({
        region: 'us-east-1'
    })}

  async getSecret(secretName: string): Promise<any> {
    const data = await this.secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    }

    throw new Error('Secret not found');
  }
}
