# BEC-RPG: Business Email Compromise Training Platform

An interactive cybersecurity training platform focused on Business Email Compromise (BEC) awareness through gamification.

## System Requirements

- Node.js (v14.0.0+)
- npm (v6.0.0+)
- Modern web browser
- 4GB RAM minimum
- MongoDB (cloud connection included for demo)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Shahriah/BEC-RPG.git
   cd BEC-RPG
   ```

2. Install client dependencies:
   ```
   cd client
   npm install
   ```

3. Install server dependencies:
   ```
   cd ../server
   npm install
   ```

## Running the Application

1. Start the client (in client directory):
   ```
   npm start
   ```

2. Start the server (in server directory):
   ```
   npm start
   ```

3. Access the application at: http://localhost:3000

## Testing

Run test coverage in either directory:
```
cd client
npm run test:coverage
```

## Usage Guide

1. **Select Role**: Choose a role from the side panel
2. **Complete Missions**: Progress through missions in order
3. **Earn Points**: Accumulate points to advance in rank
4. **Track Progress**: Monitor your advancement on the dashboard

## Troubleshooting

- **Locked Missions**: Ensure you've selected a role and completed prior missions
- **Progress Issues**: Try refreshing the page
- **Connection Errors**: Verify both server and client are running

## Demo Account

The application uses a "testuser" account for demonstration purposes. Progress is maintained during the session and persists between page refreshes.

## Technologies

- Frontend: React, Tailwind CSS
- Backend: Express.js, Node.js
- Database: MongoDB
- Testing: Jest
