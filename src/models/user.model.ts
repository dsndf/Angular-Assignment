export interface User {
  email: string;
  phone: string;
  fullname: string;
  password: string;
  organizationId: string;
  organizationName: string;
  designation: string;
  pincode: number;
  city: string;
  dob: string;
  
}
export interface SingupData {
  emailOrPhoneNo: string;
  fullname: string;
  password: string;
  organizationId: string;
  organizationName: string;
  designation: string;
  pincode: string;
  city: string;
  dob: string;
}
