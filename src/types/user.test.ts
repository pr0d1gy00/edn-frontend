import { describe, it, expect } from 'vitest';
import type { User, CreateUserInput, UpdateUserInput } from '@/types/user';

describe('User types', () => {
  it('User interface has required and optional fields', () => {
    const minimalUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER',
    };

    expect(minimalUser.id).toBe('user-1');
    expect(minimalUser.email).toBe('test@example.com');
    expect(minimalUser.username).toBe('testuser');
    expect(minimalUser.role).toBe('USER');
    expect(minimalUser.createdAt).toBeUndefined();
    expect(minimalUser.updatedAt).toBeUndefined();
  });

  it('User interface accepts ADMIN role', () => {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@example.com',
      username: 'admin',
      role: 'ADMIN',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z',
    };

    expect(adminUser.role).toBe('ADMIN');
    expect(adminUser.createdAt).toBe('2025-01-01T00:00:00Z');
    expect(adminUser.updatedAt).toBe('2025-06-01T00:00:00Z');
  });

  it('CreateUserInput requires email, username, and password with optional role', () => {
    const minimalInput: CreateUserInput = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
    };

    expect(minimalInput.email).toBe('new@example.com');
    expect(minimalInput.username).toBe('newuser');
    expect(minimalInput.password).toBe('password123');
    expect(minimalInput.role).toBeUndefined();

    const fullInput: CreateUserInput = {
      email: 'admin2@example.com',
      username: 'admin2',
      password: 'securepass',
      role: 'ADMIN',
    };
    expect(fullInput.role).toBe('ADMIN');
  });

  it('UpdateUserInput makes all fields optional', () => {
    const emptyUpdate: UpdateUserInput = {};
    expect(emptyUpdate).toBeDefined();

    const emailOnly: UpdateUserInput = { email: 'updated@example.com' };
    expect(emailOnly.email).toBe('updated@example.com');
    expect(emailOnly.username).toBeUndefined();

    const roleOnly: UpdateUserInput = { role: 'ADMIN' };
    expect(roleOnly.role).toBe('ADMIN');

    const fullUpdate: UpdateUserInput = {
      email: 'full@example.com',
      username: 'fulluser',
      role: 'ADMIN',
      password: 'newpassword',
    };
    expect(fullUpdate.password).toBe('newpassword');
  });
});
