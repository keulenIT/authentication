import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]',
      {
        email: email,
        password: password,
      }
    );
  }
}
