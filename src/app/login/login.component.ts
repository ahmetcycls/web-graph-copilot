import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // or .scss if you are using Sass
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.updateLoginStatus();
  }

  async updateLoginStatus(): Promise<void> {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
