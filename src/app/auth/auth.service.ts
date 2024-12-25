import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { firebaseToken } from '../../configuration/config';
import { AuthResponseData } from './auth.model';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private http = inject(HttpClient);
  private tokenExpirationTimer: any;

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred!';
    if (!error.error) {
      return throwError(() => new Error(errorMessage));
    } else {
      switch (error.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists';
          break;
        case 'INVALID_LOGIN_CREDENTIALS':
          errorMessage = 'Wrong password or username';
          break;
      }
      return throwError(() => new Error(errorMessage));
    }
  }
  private handleAuthentication(
    email: string,
    token: string,
    userId: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, token, userId, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseToken}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
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
        catchError(this.handleError),
        tap((response) => {
          this.handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      _token: string;
      id: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const storedUser = new User(
      userData.email,
      userData._token,
      userData.id,
      new Date(userData._tokenExpirationDate)
    );
    if (storedUser.token) {
      this.user.next(storedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration  );
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
