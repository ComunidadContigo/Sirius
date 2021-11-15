export interface RefreshTokenPayload {
  u_id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_vetted: boolean;
}

export interface RefreshToken {
  u_id: number;
  token: string;
}
