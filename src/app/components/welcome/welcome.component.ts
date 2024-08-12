import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockService } from '../../services/mock.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { SideLayoutComponent } from '../layouts/side-layout/side-layout.component';
import {
  setUser,
  setWelcomeEnteredData,
} from '../../../store/reducers/actions/auth.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [ReactiveFormsModule, SideLayoutComponent, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  constructor(
    private mockService: MockService,
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {}

  ngOnInit(): void {}
  email = new FormControl('', [Validators.required, Validators.email]);
  mobileNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);

  welcomeForm = new FormGroup({
    email: this.email,
    mobileNumber: this.mobileNumber,
  });

  get emailError() {
    return {
      required: this.welcomeForm.get('email')?.errors?.['required'],
      invalidEmail: this.welcomeForm.get('email')?.errors?.['email'],
    };
  }
  get mobileNumberError() {
    let errors = this.welcomeForm.get('mobileNumber')?.errors;
    return {
      required: errors?.['required'],
      invalidMobileNumber: errors?.['minLength'] && errors?.['maxLength'],
    };
  }

  onSubmit(form: FormGroup) {


    if (this.email.valid) {
      this.store.dispatch(
        setWelcomeEnteredData({
          payload: { email: form.value?.email, phone: '' },
        })
      );
      const username = this.mockService.checkUserExistByEmail(
        this.email.value as string
      );
      if (!username) {
        alert('Email not exist');
        this.router.navigateByUrl('/signup');
        return;
      } else {
     
        this.store.dispatch(
          setUser({ payload: { fullname: username as string } })
        );

        this.router.navigateByUrl('/login');
        return;
      }
    }

    if (this.mobileNumber.valid) {
      this.store.dispatch(
        setWelcomeEnteredData({
          payload: { email: '', phone: form.value?.mobileNumber },
        })
      );
      if (
        !this.mockService.checkUserExistByPhone(
          this.mobileNumber.value as string
        )
      ) {
        alert('Mobile no. not exist');
        this.router.navigateByUrl('/signup');
      } else {
        this.router.navigateByUrl('/login');
      }
    }
  }
}
