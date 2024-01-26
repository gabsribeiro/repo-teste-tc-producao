import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwksClient } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwks = new JwksClient({
      jwksUri: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_acioiSPS0/.well-known/jwks.json`,
    });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: '60kovcmoralh3svpetj8gs4f6h',
      issuer: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_acioiSPS0`,
      algorithms: ['RS256'],
      secretOrKeyProvider: (req, rawJwtToken, done) => {
        // console.log(rawJwtToken)
        const decodedHeader = JSON.parse(Buffer.from(rawJwtToken.split('.')[0], 'base64').toString());
  
        if (!decodedHeader.kid) {
          return done(new Error('No kid specified in token'), null);
        }
        // console.log(decodedHeader);
        
        // const decodedToken = JSON.parse(Buffer.from(rawJwtToken.split('.')[1], 'base64').toString());
        // console.log(`Decoded Token: ${JSON.stringify(decodedToken)}`);
        
        jwks.getSigningKey(decodedHeader.kid, (err, key) => {
          if (err) {
            console.error('Erro ao recuperar a chave de assinatura do JWKS', err);
            return done(err, null);
          }
          const signingKey = key.getPublicKey();
          done(null, signingKey);
        });
      },
    });
  }

  async validate(payload: any) {
    // console.log(`Payload do Token: ${JSON.stringify(payload)}`);
    return { userId: payload.sub, username: payload['cognito:username'] };
  }
}
