
export type UserRole = 'user' | 'admin';

export interface AdminUser {
    id: string;
    email: string; // From auth.users or users table
    role: UserRole;
    notes?: string;
    full_name?: string;
    created_at?: string;
}
