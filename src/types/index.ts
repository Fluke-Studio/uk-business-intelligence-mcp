export interface ApiKeyRecord {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  is_active: boolean;
}

export interface UserRecord {
  id: string;
  email: string;
  plan: string;
}

export type AuthResult =
  | { success: true; apiKeyRecord: ApiKeyRecord; user: UserRecord }
  | { success: false; error: string };
