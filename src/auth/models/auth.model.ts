export interface RefreshTokenPayload {
  u_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface RefreshToken {
  u_id: number;
  token: string;
  expo_push_token?: string;
}
