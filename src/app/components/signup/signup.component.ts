import { Component } from '@angular/core';
import { SideLayoutComponent } from '../layouts/side-layout/side-layout.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { MockService } from '../../services/mock.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SingupData } from '../../../models/user.model';
import { CustomError } from '../../../utils/errorHandler';
import { setIsAuth } from '../../../store/reducers/actions/auth.action';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SideLayoutComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  tab: number = 1;
  afterSignUp: boolean = false;
  auth$?: Observable<AuthState>;
  emailOrPhoneNoInitialValue: string = '';
  constructor(
    private mockServices: MockService,
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.auth$ = store.select('auth');
    this.auth$.subscribe({
      next: (data) => {
        let value =
          data.welcomeEnteredData.email || data.welcomeEnteredData.phone;
        if (!this.emailOrPhoneNoInitialValue.length && value) {
          this.emailOrPhoneNo.setValue(value);
          this.emailOrPhoneNoInitialValue = value;
        }
      },
    });
  }

  emailOrPhoneNo = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  fullname = new FormControl('', [Validators.required]);
  organizationName = new FormControl('', [Validators.required]);
  organizationId = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  pincode = new FormControl('', [Validators.required]);
  dob = new FormControl('', [Validators.required]);
  designation = new FormControl('', [Validators.required]);

  signupForm = new FormGroup({
    emailOrPhoneNo: this.emailOrPhoneNo,
    password: this.password,
    fullname: this.fullname,
    organizationName: this.organizationName,
    organizationId: this.organizationId,
    city: this.city,
    pincode: this.pincode,
    dob: this.dob,
    designation: this.designation,
  });

  get designations() {
    return this.mockServices.designations;
  }

  async nextHandler(e: Event) {
    e.preventDefault();
    try {
      if (this.tab === 2) {
        console.log(this.signupForm.value);
        if (this.signupForm.valid)
          await this.mockServices.signupUserHandler(
            this.signupForm.value as SingupData
          );
        this.afterSignUp = true;
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3000);
      } else {
        await this.mockServices.validateEmailOrPhoneNo(
          this.signupForm.get('emailOrPhoneNo')?.value!
        );
        this.tab = 2;
      }
    } catch (error) {

      console.log(error);
      if (error instanceof CustomError) {
        if (error.name === 'emailOrPhone') {
          this.emailOrPhoneNo.setErrors([error.message]);
        } else if (error.name === 'org') {
          this.organizationName.setErrors([error.message]);
        } else if (error.name === 'org-id') {
          this.organizationId.setErrors([error.message]);
        } else if (error.name === 'pincode') {
          this.pincode.setErrors([error.message]);
        }
      }
    }
  }
  goBackHandler() {
    this.tab = 1;
  }
}
