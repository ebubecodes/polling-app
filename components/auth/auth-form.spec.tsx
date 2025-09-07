import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthForm } from '@/components/auth/auth-form'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

// Mock the modules
vi.mock('next/navigation')
vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}))

describe('AuthForm', () => {
  const push = vi.fn()
  const signInWithPassword = vi.fn()
  const signUp = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(signInWithPassword);
    (supabase.auth.signUp as jest.Mock).mockImplementation(signUp)
  })

  it('renders sign-in form correctly', () => {
    render(<AuthForm mode="sign-in" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders sign-up form correctly', () => {
    render(<AuthForm mode="sign-up" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()
  })

  it('allows typing in email and password fields', () => {
    render(<AuthForm mode="sign-in" />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('calls signInWithPassword on submit in sign-in mode', async () => {
    signInWithPassword.mockResolvedValue({ error: null })
    render(<AuthForm mode="sign-in" />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('calls signUp on submit in sign-up mode', async () => {
    signUp.mockResolvedValue({ error: null })
    render(<AuthForm mode="sign-up" />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('displays an error message on failed sign-in', async () => {
    const errorMessage = 'Invalid login credentials'
    signInWithPassword.mockResolvedValue({ error: { message: errorMessage } })
    render(<AuthForm mode="sign-in" />)

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('displays an error message on failed sign-up', async () => {
    const errorMessage = 'User already registered'
    signUp.mockResolvedValue({ error: { message: errorMessage } })
    render(<AuthForm mode="sign-up" />)

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('redirects to /polls on successful sign-in', async () => {
    signInWithPassword.mockResolvedValue({ error: null })
    render(<AuthForm mode="sign-in" />)

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/polls')
    })
  })

  it('redirects to /polls on successful sign-up', async () => {
    signUp.mockResolvedValue({ error: null })
    render(<AuthForm mode="sign-up" />)

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/polls')
    })
  })

  it('disables form elements while loading', async () => {
    signInWithPassword.mockReturnValue(new Promise(() => {})) // Never resolves
    render(<AuthForm mode="sign-in" />)

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByLabelText(/email/i)).toBeDisabled()
      expect(screen.getByLabelText(/password/i)).toBeDisabled()
      expect(screen.getByRole('button')).toHaveTextContent('Loading...')
    })
  })
})
