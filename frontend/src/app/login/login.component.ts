import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../sdk/services/core/auth.service';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ToasterService } from 'angular2-toaster';
import { UserApi } from '../../sdk/services/custom/user.service';

// import {EmployeeApi} from '../../sdk/services/custom/Employee';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage;
  isLoading = false;
  isFormSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private slimLoadingBarService: SlimLoadingBarService,
    private toasterService: ToasterService,
    private userApi: UserApi // private userApi: UserApi
  ) {}

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.isFormSubmitted = true;

      this.userApi.login(this.loginForm.value).subscribe(
        data => {
          localStorage.setItem('token', data.data);
          this.router.navigate(['/admin']);
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          console.log(error);
        }
      );
    }
  }
}
