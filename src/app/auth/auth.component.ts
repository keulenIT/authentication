import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private authObs$: Observable<AuthResponseData>;
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  isLoading = false;
  error = null;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    if (this.isLoginMode) {
      this.authObs$ = this.authService.login(email, password);
    } else {
      this.authObs$ = this.authService.signUp(email, password);
    }
    this.authObs$.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
      },
      (error) => {
        this.error = error;
        this.isLoading = false;
      }
    );
    form.reset();
  }
}
