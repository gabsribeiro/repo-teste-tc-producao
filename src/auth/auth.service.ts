import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserDTO } from './dto/UserDTO';
import { Observable, catchError, map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  private readonly BASE_URL = 'https://br75f66nkb.execute-api.us-east-1.amazonaws.com/Prod';

  constructor(private readonly httpService: HttpService) {}

  authenticate(userDTO: UserDTO): Observable<string> {
    const headers = { 'Content-Type': 'application/json' };
    return this.httpService.post(`${this.BASE_URL}/auth`, userDTO, { headers })
      .pipe( map(response => response.data),
      );
  }
}
