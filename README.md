# Anonymous Feedback

Anonymous Feedback is a platform that allows users to provide honest, anonymous feedback without fear of judgment. This project is aimed at creating a safe environment where individuals can express their thoughts and suggestions freely.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)<!-- - [Usage](#usage) -->
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Anonymous Feedback is a web application built with Next.js and TypeScript that allows users to send and receive feedback anonymously. The project leverages Mongoose for data modeling and Zod for schema validation. In the future, the app will integrate with the ChatGPT API to suggest random feedback for users.

## Features

- **User Management**: Users can sign up, sign in, and receive messages.
- **Anonymous Feedback**: Users can receive anonymous feedback, which is stored in their account.
- **Schema Validation**: Zod is used for validating various schemas such as sign up, sign in, and message handling.
- **Random Feedback Suggestions** (coming soon): The app will integrate with ChatGPT to generate feedback suggestions.

## Tech Stack

- **Next.js**: React-based framework for server-side rendering and routing.
- **TypeScript**: Type safety and modern JavaScript features.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Zod**: TypeScript-first schema validation.
- **ChatGPT API** (planned): Will be used for generating random feedback suggestions.

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

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
