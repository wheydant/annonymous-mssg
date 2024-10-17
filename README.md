# Anonymous Feedback

Anonymous Feedback is a platform that allows users to provide honest, anonymous feedback without fear of judgment. This project is aimed at creating a safe environment where individuals can express their thoughts and suggestions freely.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Theory](#theory)
    - [Model and Schema Handling](#model-and-schema-handling)
    - [Email Handling](#email-handling)
    - [Sign-in Page Using auth.js](#create-sign-in-page-using-nextauth)
- [Installation](#installation)<!-- - [Usage](#usage) -->
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Anonymous Feedback is a web application built with Next.js and TypeScript that allows users to send and receive feedback anonymously. The project leverages Mongoose for data modeling, Zod for schema validation, and Resend as an email service provider.

## Features

- **User Management**: Users can sign up, sign in, and receive messages.
- **Email Handling**: Sends verification emails upon user sign-up.
- **Schema Validation**: Zod is used for validating various schemas such as sign up, sign in, and message handling with various [regexr](https://regexr.com/).
- **Random Feedback Suggestions** (coming soon): The app will integrate with ChatGPT to generate feedback suggestions.

## Tech Stack

- [**Next.js**](https://nextjs.org/): React-based framework for server-side rendering and routing.
- [**TypeScript**](https://www.typescriptlang.org/): Type safety and modern JavaScript features.
- [**Mongoose**](https://www.npmjs.com/package/mongoose): MongoDB object modeling for Node.js.
- [**Zod**](https://www.npmjs.com/package/zod): TypeScript-first schema validation.
- [**Resend**](https://resend.com/docs/introduction): Email service provider for sending verification emails powered by [react-email](https://react.email/docs/introduction).
- [**NextAuth.js**](https://next-auth.js.org/): Authentication for Next.js applications, using JWT for session management and providing various authentication strategies.
- **ChatGPT API** (planned): Will be used for generating random feedback suggestions.

## Theory
### <ins>Model and Schema Handling</ins>

1. **User and Message Models**: 
   - Created Mongoose models for `User` and `Message`. The `User` model contains fields such as `username`, `email`, and `password`, along with an array of messages received by the user.
   - Implemented email validation using a regular expression (regex) within the Mongoose schema to ensure valid email addresses.

2. **Zod Frontend Schema Validation**:
   - Created frontend validation schemas using Zod for various user-related actions, including:
     - **Sign-Up**: Validates user registration data (username, email, password, etc.).
     - **Sign-In**: Ensures valid credentials during login.
     - **Message Handling**: Validates message contents and structures before sending or receiving.
     - **Verification**: Checks the validity of verification codes and other related data.
   - These schema checks ensure robust data validation on the client side before submitting any requests to the server, enhancing overall security and reducing potential errors.

### <ins>Email Handling</ins>

The email verification process is handled with the following steps:

1. **Email Template**: Created an email template using `react-email` components in `emails/VerificationEmail.tsx`. The template uses `.tsx` for React-based HTML rendering.
   
2. **Resend Connection**: Created a `resend.ts` file in the `lib` folder to connect to the Resend email service provider.

3. **API Response Types**: Defined types for API responses to ensure proper structure and consistency.

4. **Helper File**: Added a helper file (`helpers/sendVerificationEmail.ts`) to send verification emails. This integrates:
   - The email template (1)
   - Resend connection (2)
   - API response structure (3)

5. **API Route**: Implemented the `/sign-up` API endpoint (`src/app/api/sign-up/route.ts`) that uses the helper file to handle user sign-up and email verification.

### Create Sign-In Page using NextAuth

1. **API Setup for NextAuth**:
   - Created API files for NextAuth in `app/api/auth/[...nextauth]/options.ts` (optional) and `route.ts`.

2. **NextAuth Documentation**:
   - Referring to the NextAuth documentation for:
     - Providers (e.g., Google, GitHub)
     - Configuration for Pages and Callbacks

3. **NextAuthOptions Setup**:
   - In `options.ts`, configured:
     - **Providers**: Added credential-based authentication (email and password) with a custom `authorize` function.
     - **Pages**: Changed the default `/auth/sign-in` to `/sign-in`.
     - **Session**: Configured session strategy using JWT (JSON Web Tokens).
     - **Callbacks**: Modified tokens and sessions to include more user details and avoid redundant database queries.

4. **NextAuth Module Customization**:
   - Created `src/types/next-auth.d.ts` to extend the `User`, `Session`, and `JWT` interfaces, adding more fields for custom session management.

5. **Middleware**:
   - Created `src/middleware.ts` to manage the entire NextAuth flow, which includes:
     - **Config**: Specifies paths where the middleware should apply.
     - **Middleware**: Contains the logic for redirecting and managing authentication flows.

6. **Front-End for Sign-In**:
   - Developed the front-end for the sign-in page in `src/app/sign-in/page.tsx` using the `[auth]` bundle format to prevent routing to `/auth/sign-in`.
   - Added `'use client'` directive at the top of the client-side page for proper functionality.
   - Created `context/AuthProvider.tsx` to wrap the page with `<SessionProvider>`, and finally wrapped the layout in `src/app/layout.tsx`.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/anonymous-feedback.git
   ```

2. Navigate to the project directory:

    ```bash
    cd anonymous-feedback
    ```

3. Install the necessary dependencies for both frontend and backend:

    ```bash
    npm install
    ```


4. Start the development server:

    ```bash
    npm run dev
    ```

<!-- ## Usage

1. Navigate to the frontend interface in your browser.
2. Users can submit feedback anonymously.
3. Admins can log in to review and respond to feedback. -->

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is for personal use only. You may modify or distribute the code for personal projects, but it is not to be used for commercial purposes without explicit permission from the author.

