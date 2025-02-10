# NotePink Application

Welcome to NotePink! This project leverages a modern, full-stack TypeScript framework to deliver a type-safe, scalable, and efficient web application.

## Tech Stack Overview

### Next.js
A powerful React framework that offers server-side rendering, static site generation, and a rich ecosystem for building modern web applications.

### TypeScript
A statically typed superset of JavaScript that enhances code quality and developer productivity by catching errors at compile time.

### tRPC
Facilitates end-to-end type safety between the client and server, eliminating the need for manual API schema definitions.

### Prisma
A next-generation ORM that simplifies database interactions through type-safe queries and migrations. Prisma supports various databases including PostgreSQL, MySQL, and SQLite.

### Clerk
A flexible authentication solution for Next.js applications that supports multiple providers and custom authentication flows.

### Tailwind CSS
A utility-first CSS framework that accelerates UI development with its extensive array of pre-defined classes, ensuring rapid and consistent styling.

## Getting Started

Follow the steps below to set up and run the application on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
    - [Download Node.js](https://nodejs.org/)
- pnpm
    - Install globally by running: `npm install -g pnpm`

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/cs421sp25-homework/homework-Deodat-Lawson.git
   cd your-repo
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the project root:
   ```bash
   touch .env
   ```

   Add the following configuration:
   ```plaintext
   DATABASE_URL="Sample Postgres Database URL"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
   CLERK_SECRET_KEY=sk_test_your-secret-key

   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/notes
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding
   ```

4. **Set Up the Database with Prisma**
   ```bash
   pnpm exec prisma migrate dev
   
   # Optional: Seed the database if a seed script is provided
   pnpm exec prisma db seed
   ```

5. **Running the Application Locally**
   ```bash
   pnpm run dev
   ```
   Once running, visit http://localhost:3000 in your web browser.

### Additional Scripts

**Build for Production**
```bash
pnpm run build
pnpm start
```

**Linting**
```bash
pnpm run lint
```

## Testing CRUD Operations

### 1. Create a New Note

#### Via the UI
1. Log into the application at http://localhost:3000
2. Navigate to /notes
3. Click on Create New Note
4. Fill out the form (title, content) and submit
5. Verify the new note appears in your list

#### Via API or tRPC
Use Thunder Client, Postman, or cURL to send a request to your endpoint (e.g., `/api/trpc/notes.create`):

```json
{
  "title": "My First Note",
  "content": "Hello, this is a test note."
}
```

### 2. Read Existing Notes

#### Via the UI
1. Go to your Notes page when logged in
2. Verify your notes are displayed correctly

#### Via API or tRPC
Send a GET request to your endpoint (e.g., `/api/trpc/notes.getAll`)

### 3. Update a Note

#### Via the UI
1. Select an existing note
2. Click Edit or navigate to the edit page
3. Modify the note's content and save
4. Verify the changes are reflected

#### Via API or tRPC
Send a PUT/PATCH request to your endpoint (e.g., `/api/trpc/notes.update`):

```json
{
  "id": "1",
  "title": "Updated Note Title",
  "content": "Updated note content."
}
```

### 4. Delete a Note

#### Via the UI
1. Locate the note to remove
2. Click the Delete button
3. Confirm if prompted
4. Verify the note is removed

#### Via API or tRPC
Send a DELETE request to your endpoint (e.g., `/api/trpc/notes.delete`):

```json
{
  "id": "1"
}
```

### 5. Verify Results in Database
1. Log into your database
2. Check the Notes table to confirm changes

## Setting Up Clerk Authentication

### Initial Setup

1. **Create a Clerk Account and Project**
    - Visit [clerk.com](https://clerk.com)
    - Create an account and project
    - Copy the Publishable Key and Secret Key

2. **Install Clerk Dependencies**
   ```bash
   pnpm add @clerk/nextjs
   ```

3. **Update Environment Variables**
   ```plaintext
   DATABASE_URL="Sample Postgres Database URL"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
   CLERK_SECRET_KEY=sk_test_your-secret-key

   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/notes
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding
   ```

4. **Customize Session Token**

   In your Clerk dashboard (Configure → Sessions → Customize session token):
   ```json
   {
     "metadata": "{{user.public_metadata}}"
   }
   ```

### Testing Authentication

#### Development Testing
```bash
# Start development server
pnpm run dev

# Test authentication flow:
# 1. Visit http://localhost:3000 and click "Get Started"
# 2. Create a test account
# 3. Verify redirect to onboarding
# 4. Test protected routes
# 5. Test sign-out functionality
```

#### Production Testing
- Test in staging environment first
- Verify email verification flow
- Test password reset functionality
- Confirm OAuth providers if configured

## Troubleshooting

### Common Issues

1. **Invalid API Key**
    - Verify environment variables
    - Ensure correct keys for environment

2. **Middleware Errors**
    - Check middleware configuration
    - Verify public routes
    - Clear browser cache and cookies

3. **Redirect Issues**
    - Confirm redirect URLs in Clerk dashboard
    - Verify environment variables for sign-in/sign-up URLs

For additional help, consult the [Clerk Documentation](https://clerk.com/docs) or reach out to Clerk support.

Happy Coding! If you have any questions, feel free to create an issue or open a pull request.