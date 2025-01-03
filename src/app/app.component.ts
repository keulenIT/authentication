import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private AuthService = inject(AuthService);

  ngOnInit() {
    this.AuthService.autoLogin();
  }
}
