# Polling App

A full-stack polling application built with Next.js and Supabase that allows users to create, share, and vote on polls.

## Overview and Purpose

This project is a web application designed to provide a seamless experience for creating and managing polls. Registered users can create custom polls, which can then be shared via a unique link. Other users (both authenticated and anonymous, depending on the poll's settings) can then vote on these polls.

The primary goal is to build a secure, scalable, and user-friendly platform for gathering opinions.

## Features

- **User Authentication:** Secure sign-up and sign-in functionality using Supabase Auth.
- **Poll Creation:** Authenticated users can create polls with custom titles, questions, and multiple options.
- **Poll Management:** Users can edit or delete the polls they have created.
- **Voting System:** Users can vote on polls. The system prevents duplicate votes from authenticated users.
- **Configurable Polls:** Poll creators can configure settings such as requiring authentication to vote or setting an end date.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20.x or later recommended)
- [npm](https://www.npmjs.com/) (v10.x or later recommended)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/polling-app.git
    cd polling-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Next, fill in the required values in `.env.local`. You can find these keys in your Supabase project's API settings.

    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project's public `anon` key.
    - `SUPABASE_SECRET_KEY`: Your Supabase project's secret `service_role` key.

4.  **Run the database migrations (if applicable):**
    If you are setting up a new Supabase project, you will need to run the SQL migrations located in the `supabase/migrations` directory in the Supabase SQL Editor.

### Running the Application

Once the installation is complete, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage Examples

Once the application is running, you can perform the following actions:

1.  **Create an Account:**
    - Navigate to the "Sign Up" page from the header.
    - Register a new account with your email and a password.

2.  **Create a Poll:**
    - After signing in, you will be redirected to the main polls page.
    - Click the "Create Poll" button.
    - Fill in the "Basic Info" tab with a title, question, and at least two options.
    - (Optional) Switch to the "Settings" tab to require authentication for voters or set an end date.
    - Click "Create Poll" to submit. You will be redirected to your new poll's page.

3.  **Vote on a Poll:**
    - From the main polls page, click on any poll to view it.
    - Select one of the options.
    - Click "Submit Vote". If the poll creator required authentication, you must be logged in to vote.

## How to Run Tests

This project uses Vitest for unit and integration testing. To run the test suite, use the following command:

```bash
npm run test
```

## Project Structure

The codebase is organized following Next.js App Router conventions:

- `/app`: Contains all the routes and pages for the application.
- `/components`: Houses reusable React components.
  - `/components/ui`: `shadcn/ui` components.
  - `/components/auth`: Components related to authentication.
  - `/components/polls`: Components for poll creation, voting, etc.
- `/lib`: Core application logic, server actions, and Supabase client setup.
  - `/lib/actions`: Server Actions for data mutations (creating polls, voting).
  - `/lib/supabase`: Supabase client configurations.
- `/supabase/migrations`: Contains the SQL schema for the database.

## Dependencies and Tools

- **Framework:** [Next.js](https://nextjs.org/)
- **Database & Auth:** [Supabase](https://supabase.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Linting:** [ESLint](https://eslint.org/)