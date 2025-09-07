import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { PollForm } from '@/components/polls/poll-form'
import { useRouter } from 'next/navigation'
import { createPollAction } from '@/lib/actions/polls'

// Mock the modules
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))
vi.mock('@/lib/actions/polls', () => ({
  createPollAction: vi.fn(),
}))

describe('PollForm', () => {
  const push = vi.fn()
  const mockCreatePollAction = createPollAction as jest.Mock

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push })
  })

  it('renders the basic info tab by default', () => {
    render(<PollForm />)
    expect(screen.getByLabelText(/poll title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/question/i)).toBeInTheDocument()
    expect(screen.getByText(/poll options/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create poll/i })).toBeInTheDocument()
  })

  it('switches to the settings tab on click', () => {
    render(<PollForm />)
    const settingsButton = screen.getByRole('button', { name: /settings/i })
    fireEvent.click(settingsButton)

    expect(screen.getByLabelText(/allow users to select multiple options/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/require users to be logged in to vote/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/poll end date/i)).toBeInTheDocument()
  })

  it('allows adding a new poll option', () => {
    render(<PollForm />)
    const addOptionButton = screen.getByRole('button', { name: /add option/i })
    fireEvent.click(addOptionButton)

    const optionInputs = screen.getAllByPlaceholderText(/option \d/i)
    expect(optionInputs).toHaveLength(3)
  })

  it('allows removing a poll option when there are more than two', () => {
    render(<PollForm />)
    const addOptionButton = screen.getByRole('button', { name: /add option/i })
    fireEvent.click(addOptionButton) // Now 3 options

    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    expect(removeButtons).toHaveLength(3)
    fireEvent.click(removeButtons[0])

    const optionInputs = screen.getAllByPlaceholderText(/option \d/i)
    expect(optionInputs).toHaveLength(2)
  })

  it('does not show remove button when there are only two options', () => {
    render(<PollForm />)
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('submits the form with the correct data', async () => {
    mockCreatePollAction.mockResolvedValue(undefined)
    render(<PollForm />)

    // Fill out basic info
    fireEvent.change(screen.getByLabelText(/poll title/i), {
      target: { value: 'Favorite Color' },
    })
    fireEvent.change(screen.getByLabelText(/question/i), {
      target: { value: 'What is your favorite color?' },
    })
    const optionInputs = screen.getAllByPlaceholderText(/option \d/i)
    fireEvent.change(optionInputs[0], { target: { value: 'Red' } })
    fireEvent.change(optionInputs[1], { target: { value: 'Blue' } })

    // Switch to settings and change them
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    fireEvent.click(screen.getByLabelText(/allow users to select multiple options/i)) // Check it
    fireEvent.click(screen.getByLabelText(/require users to be logged in to vote/i)) // Uncheck it

    // Submit the form
    const createButton = screen.getByRole('button', { name: /create poll/i })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockCreatePollAction).toHaveBeenCalledTimes(1)
      const formData = mockCreatePollAction.mock.calls[0][0]
      expect(formData.get('title')).toBe('Favorite Color')
      expect(formData.get('question')).toBe('What is your favorite color?')
      expect(formData.getAll('options')).toEqual(['Red', 'Blue'])
      expect(formData.get('allowMultiple')).toBe('on')
      expect(formData.get('requireAuth')).toBe(null) // Unchecked checkbox
    })
  })

  // it('shows a loading state when submitting', async () => {
  //   // Make the action promise never resolve to keep it in a loading state
  //   mockCreatePollAction.mockImplementation(() => new Promise(() => {}))
  //   render(<PollForm />)

  //   await act(async () => {
  //     fireEvent.click(screen.getByRole('button', { name: /create poll/i }))
  //   })

  //   const submitButton = screen.getByRole('button', {
  //     name: /creating poll.../i,
  //   })
  //   expect(submitButton).toBeDisabled()
  // })

  it('calls router.push on cancel', () => {
    render(<PollForm />)
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    expect(push).toHaveBeenCalledWith('/polls')
  })
})
