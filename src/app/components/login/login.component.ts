import { Component, OnInit } from '@angular/core';
import { MockService } from '../../services/mock.service';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { SideLayoutComponent } from '../layouts/side-layout/side-layout.component';
import {
  setIsAuth,
  setLoading,
} from '../../../store/reducers/actions/auth.action';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CustomError } from '../../../utils/errorHandler';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SideLayoutComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  emailOrPhoneNoInitialValue: string = '';
  welcomeMessage = 'Welcome';
  auth$?: Observable<AuthState>;
  isAuthOnLogin:boolean=false;
  constructor(
    private mockService: MockService,
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.auth$ = store.select('auth');
    this.auth$.subscribe({
      next: (data) => {
        let value =
          data.welcomeEnteredData.email || data.welcomeEnteredData.phone;
        if (!this.emailOrPhoneNoInitialValue.length && value) {
          alert('EPV');
          this.emailOrPhoneNo.setValue(value);
          this.emailOrPhoneNoInitialValue = value;
        }
        this.welcomeMessage = data.user
          ? `Welcome Back, ${data.user.fullname}!`
          : this.welcomeMessage;
      },
    });
  }

  emailOrPhoneNo = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  loginForm = new FormGroup({
    emailOrPhoneNo: this.emailOrPhoneNo,
    password: this.password,
  });
 


  async onSubmit(form: FormGroup) {
    this.store.dispatch(setLoading({ payload: true }));
    try {
      if (form.valid) {
        await this.mockService.loginHandler({
          emailOrPhone: this.emailOrPhoneNo.value as string,
          password: this.password.value as string,
        });
        this.isAuthOnLogin=true
      }
      this.store.dispatch(setIsAuth({ payload: true }));
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.name === 'emailOrPhone') {
          this.emailOrPhoneNo.setErrors([error.message]);
        } else {
          this.password.setErrors([error.message]);
        }
      }
      console.log(error);
    } finally {
      this.store.dispatch(setLoading({ payload: false }));
    }
  }
}
