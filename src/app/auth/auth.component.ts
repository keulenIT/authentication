import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private authObs$: Observable<AuthResponseData>;
  private authService = inject(AuthService);

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
      },
      (error) => {
        this.error = error;
        this.isLoading = false;
      }
    );
    form.reset();
  }
}
