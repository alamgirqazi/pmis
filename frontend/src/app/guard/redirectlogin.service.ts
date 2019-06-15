import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../../sdk/services/core/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class RedirectLoginGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    if (this.authService.getAccessTokenId()) {
      this.router.navigateByUrl('/admin');
    } else {
      return true;
    }
  }
}
