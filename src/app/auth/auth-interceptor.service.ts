import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        console.log('User is: ', user);
        if (!user) {
          return next.handle(req);
        }
        const tokenizedRequest = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(tokenizedRequest);
      })
    );
  }
}
