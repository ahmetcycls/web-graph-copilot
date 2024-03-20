// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {from, mergeMap, Observable} from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import {switchMap} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private keycloakService: KeycloakService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.keycloakService.getToken()).pipe(
      mergeMap(token => {
        const authReq = !!token ? request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }) : request;
        return next.handle(authReq);
      })
    );
  }
}
