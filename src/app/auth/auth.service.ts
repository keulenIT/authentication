import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoading = false;

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    this.isLoading = true;

    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyDyewr-L4_2CYUsNXExcGwn9eQ4JblRwAs',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .subscribe((response) => {
        this.isLoading = false;
      });
  }
}
