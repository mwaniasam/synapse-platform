# Synapse Platform Setup Guide

This guide will walk you through setting up and running the Synapse Platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (LTS version recommended) and **npm** (comes with Node.js)
*   **PostgreSQL** database server (or access to a Neon database)
*   **Git** (for cloning the repository)

## Step-by-Step Setup

1.  **Clone the Repository**

    If you haven't already, clone the project repository:

    \`\`\`bash
    git clone [repository-url]
    cd synapse-platform
    \`\`\`

2.  **Install Dependencies**

    Navigate to the project root and install the required Node.js packages:

    \`\`\`bash
    npm install
    \`\`\`

    This command will install all dependencies listed in `package.json`.

3.  **Set Up Environment Variables**

    Create a `.env.local` file in the root of your project by copying the example:

    \`\`\`bash
    cp .env.local.example .env.local
    \`\`\`

    Now, open `.env.local` and fill in the following:

    *   **`DATABASE_URL`**: Your PostgreSQL connection string.
        *   If you're using a local PostgreSQL, it might look like:
            `postgresql://synapse_user:synapse_password@localhost:5432/synapse_db?schema=public`
        *   If you're using Neon, get your connection string from the Neon dashboard.
    *   **`DIRECT_URL`**: This should be the same as `DATABASE_URL`.
    *   **`NEXTAUTH_SECRET`**: A strong, random string. You can generate one using `openssl rand -base64 32` in your terminal.
    *   **`OPENAI_API_KEY`**: Your API key from OpenAI (if you plan to use AI features).

4.  **Database Initialization and Seeding**

    Run the complete setup script to push your Prisma schema to the database and seed it with initial data:

    \`\`\`bash
    chmod +x scripts/complete-setup.sh
    ./scripts/complete-setup.sh
    \`\`\`

    This script will:
    *   Install npm dependencies (if not already done).
    *   Push the Prisma schema to your database.
    *   Generate the Prisma client.
    *   Seed the database with a test user (`test@example.com` / `password123`).

    **Troubleshooting `complete-setup.sh`:**
    *   If `npm install` fails, check your network connection or npm cache.
    *   If `prisma db push` fails, ensure your `DATABASE_URL` in `.env.local` is correct and your database server is running and accessible.
    *   If `db:seed` fails, check `prisma/seed.ts` for errors.

5.  **Start the Development Server**

    Once the setup is complete, you can start the Next.js development server:

    \`\`\`bash
    npm run dev
    \`\`\`

    The application will be accessible at `http://localhost:3000`.

## Testing Checklist

After starting the application, verify the following functionalities:

*   **User Registration:**
    *   Navigate to `/auth/signup`.
    *   Fill in name, email, and password.
    *   Click "Sign Up".
    *   Verify success toast message and redirection to `/auth/signin`.
    *   Try signing up with an email that already exists; verify the error toast message.
*   **User Sign In:**
    *   Navigate to `/auth/signin`.
    *   Enter credentials for a newly created user (or use the seeded `test@example.com` / `password123`).
    *   Click "Sign In".
    *   Verify successful login and redirection to `/dashboard`.
    *   Try signing in with incorrect credentials; verify the error toast message.
*   **Landing Page:**
    *   Navigate to the root URL (`/`).
    *   Verify the modern design, animations, and content are displayed correctly.
    *   Check responsiveness by resizing your browser window.
    *   Click "Start Learning Free" and "Watch Demo" buttons to ensure they navigate to the correct sections or pages.
*   **Navigation (Hamburger Menu):**
    *   On smaller screen sizes (e.g., mobile view in browser dev tools), verify the hamburger menu icon appears.
    *   Click the hamburger menu icon to open and close the mobile navigation.
    *   Ensure all navigation links within the mobile menu function correctly.
*   **Dashboard (Basic Access):**
    *   After successfully signing in, verify that you are redirected to and can access the `/dashboard` page. (This confirms the basic authentication flow is working).

If you encounter any issues, please refer to the troubleshooting steps or provide the error logs for further assistance.
\`\`\`
