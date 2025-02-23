
export interface CreateUserDTO {
    username: string;
    password: string;
    roleId: string;
    isActive?: boolean;
  }
  
  export interface UpdateUserDTO {
    id: string;
    username?: string;
    password?: string;
    roleId?: string;
    isActive?: boolean;
  }
  
  export interface AuthenticateUserDTO {
    username: string;
    password: string;
  }
  
  export interface UserRole {
    id: string;
    name: string;
    permissions: string[];
  }
  
  export interface UserResponse {
    id: string;
    username: string;
    roleId: string;
    isActive: boolean;
    role: UserRole;
  }
  
  export interface AuthResponse {
    token: string;
    refreshToken: string;
  }
  
  export interface RefreshTokenResponse {
    token: string;
  }
  