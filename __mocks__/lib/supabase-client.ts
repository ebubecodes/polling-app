import { vi } from 'vitest'

export const supabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
  },
}
