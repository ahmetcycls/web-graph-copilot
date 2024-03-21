// src/app/core/auth/keycloak.service.ts

import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakOptions } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AppKeycloakService {
  constructor(private keycloakService: KeycloakService) {}

  async init(): Promise<void> {
    try {
      const options: KeycloakOptions = {
        config: {
          url: 'http://localhost:8080/',
          realm: 'pm',
          clientId: 'angular',
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false
        },
        bearerExcludedUrls: ['/assets', '/clients/public'],
      };

      await this.keycloakService.init(options);
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }
}
