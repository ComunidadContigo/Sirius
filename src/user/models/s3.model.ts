export default interface S3Object {
  u_id?: number;
  email: string;
  password: string;
  phone_number: string;
  birth_date: string;
  first_name: string;
  gender: string;
  last_name: string;
  user_last_location?: string;
  is_vetted?: boolean;
  buddify?: boolean;
}
