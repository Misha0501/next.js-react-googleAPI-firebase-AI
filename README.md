This README provides instructions on how to set up and run the project both with Docker and without.

## Prerequisites

- Docker & Docker Compose
- Node.js & npm
- Firebase Auth Emulator (from a separate project)

## Firebase Auth Emulator

For authentication and the whole project to work correctly, you need to have the Firebase Auth Emulator running. This emulator is part of a separate project. Make sure to start the Firebase Auth Emulator before starting this application.

## Environment Setup

Before running the project, ensure you have set up your environment variables. Copy the contents of the `.env.example` file to the corresponding `.env` files. Adjust the variables if necessary to fit your local or production environment.


## Running with Docker

You can run the project with Docker Compose. However, it's recommended to only run the `db`, `pgadmin`, and `redis` containers using Docker. The application itself is suggested to be run via the standard development command to leverage hot-reloading and other features.

To run the recommended containers via Docker Compose:
``docker-compose up db pgadmin redis``


## Running the Application

With the database, pgAdmin, and Redis running through Docker, you can now start the application:

``npm install``
``npm run dev``

This will start the Next.js development server with hot-reloading enabled.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
