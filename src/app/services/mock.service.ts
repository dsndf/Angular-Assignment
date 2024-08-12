import { Injectable } from '@angular/core';
import { SingupData, User } from '../../models/user.model';
import {
  users as mockUsers,
  organizations,
  organizationsId,
  designations,
} from '../../data.json';
import { CustomError } from '../../utils/errorHandler';
@Injectable({
  providedIn: 'root',
})
export class MockService {
  constructor() {}
  private users: User[] = mockUsers;
  private organizations: string[] = organizations;
  private organizationsId: string[] = organizationsId;
  public designations: string[] = designations;

  validateInput(value: string) {
    // Regular expression for validating an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regular expression for validating a phone number
    // This example considers a phone number with 10 digits (you can modify the pattern as per your needs)
    const phoneRegex = /^\d{10}$/;

    if (emailRegex.test(value)) {
      return 'Email';
    } else if (phoneRegex.test(value)) {
      return 'Phone Number';
    } else {
      return 'Invalid';
    }
  }
  checkUserExistByPhone(phone: string): string | undefined {
    return this.users.find((user) => {
      return user.phone === phone;
    })?.fullname;
  }
  checkUserExistByEmail(email: string): string | undefined {
    return this.users.find((user) => {
      return user.email === email;
    })?.fullname;
  }
  verifyOrganization(val: string) {
    return this.organizations.find((v) => v === val);
  }
  verifyOrganizationId(val: string) {
    return this.organizationsId.find((v) => v === val);
  }

  async validateEmailOrPhoneNo(emailOrPhoneNo: string) {
    const validationResult = this.validateInput(emailOrPhoneNo);
    if (validationResult === 'Invalid')
      throw new CustomError(validationResult, 'emailOrPhone');
  }
  async signupUserHandler(data: SingupData) {
    // loading true

    if (!this.verifyOrganization(data.organizationName))
      throw new CustomError('Organization not allowed', 'org');
    if (!this.verifyOrganizationId(data.organizationId))
      throw new CustomError('Unknown organization id', 'org-id');
    if (data.pincode.length < 6)
      throw new CustomError('Pincode must be of 6 digits', 'pincode');
    let user: Partial<User>;
    const validationResult = this.validateInput(data.emailOrPhoneNo);
    if (validationResult === 'Invalid')
      throw new CustomError(validationResult, 'emailOrPhone');
    if (validationResult === 'Email') {
      user = {
        email: data.emailOrPhoneNo,
        phone: '',
      };
    } else {
      user = {
        email: '',
        phone: data.emailOrPhoneNo,
      };
    }
    user = {
      ...user,
      city: data.city,
      pincode: Number(data.pincode),
      fullname: data.fullname,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      dob: data.dob,
      password:data.password
    };
    this.users.push(user as User);
    // loading false
    //toast
  }
  async loginHandler(data: { emailOrPhone: string; password: string }) {
    // loading true
    const validationResult = this.validateInput(data.emailOrPhone);
    let user;
    if (validationResult === 'Invalid')
      throw new CustomError(validationResult, 'emailOrPhone');
    else if (validationResult === 'Email') {
      user = this.users.find((user) => user.email === data.emailOrPhone);
      console.log({user})
      if (!user) throw new CustomError('Email not exists', 'emailOrPhone');
    } else {
      user = this.users.find((user) => user.phone === data.emailOrPhone);
      if (!user) throw new CustomError('Mobile no. not exists', 'emailOrPhone');
    }
   
    let isPasswordMatched = (user as User).password === data.password;
    if (!isPasswordMatched)
      throw new CustomError('Incorrect password try again', 'password');
  }
}
