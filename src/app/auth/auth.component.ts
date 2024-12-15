import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
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
    if (this.isLoginMode) {
    } else {
      this.isLoading = true;
      console.log('Value of isloading', this.isLoading);
      this.authService.signUp(email, password).subscribe(
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
    }
    form.reset();
  }
}
