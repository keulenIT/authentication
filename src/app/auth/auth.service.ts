import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { firebaseToken } from '../../configuration/config';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key==${firebaseToken}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((error) => {
          let errorMessage = 'An error occurred!';
          if (!error.error) {
            return throwError(() => new Error(errorMessage));
          } else {
            switch (error.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists';
            }
            return throwError(() => new Error(errorMessage));
          }
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseToken}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((error) => {
          let errorMessage = 'An error occurred!';
          if (!error.error) {
            return throwError(() => new Error(errorMessage));
          } else {
            switch (error.error.error.message) {
              case 'USER_NOT_FOUND':
                errorMessage = 'Wrong password or username';
            }
            return throwError(() => new Error(errorMessage));
          }
        })
      );
  }
}
