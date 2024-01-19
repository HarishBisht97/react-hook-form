export interface PersonalDetails {
  name: string;
  age: string;
  sex: string;
  mobile: string;
  idType?: string;
  govtId?: string;
}

export interface AddressDetails {
  address?: string;
  state?: string;
  city?: string;
  country?: string;
  pincode?: string;
}

export interface RegistrationFormData {
  id: string;
  personalDetails: PersonalDetails;
  addressDetails: AddressDetails;
}

export interface PersonalDetailsFormData {
  name: string;
  age: number;
  mobile: string;
  sex: "male" | "female";
  idType: "Aadhar" | "PAN";
  govtId: string;
}
