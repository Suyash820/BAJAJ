# BFHL Node Graph Explorer - Node.js + React

A modern web application for parsing, validating, and analyzing hierarchical node structures using Node.js backend and React frontend.

## Project Structure

```
bajaj/
├── server/                    # Express.js backend
│   ├── index.js              # API server with graph processing logic
│   └── package.json          # Backend dependencies
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html        # HTML entry point
│   ├── src/
│   │   ├── App.js            # Main App component
│   │   ├── App.css           # Application styles
│   │   ├── index.js          # React DOM root
│   │   ├── index.css         # Global styles
│   │   └── components/
│   │       ├── InputForm.js  # Input textarea component
│   │       └── ResultDisplay.js  # Results display component
│   └── package.json          # Frontend dependencies
├── package.json              # Root package.json with scripts
└── README.md                 # This file
```

## Features

- **Graph Analysis**: Parse and validate directed graph edges (A->B format)
- **Cycle Detection**: Automatically detect cycles in the graph
- **Component Analysis**: Identify connected components and their properties
- **Tree Structure**: Analyze hierarchical tree structures
- **Responsive UI**: Modern, dark-themed interface
- **Real-time Validation**: Immediate feedback on input errors

## Setup Instructions

### Prerequisites

- Node.js 14+ installed
- npm or yarn package manager

### Installation

1. **Install root dependencies**

   ```bash
   npm install
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

## Running the Application

### Development Mode (both frontend and backend)

```bash
npm run dev
```

This runs:

- React frontend on `http://localhost:3000`
- Express backend on `http://localhost:5000`

### Production Mode

Build the React app and serve from backend:

```bash
npm run build
npm run server:prod
```

## Deployment Guide

### Local Deployment

```bash
# 1. Install all dependencies
npm install
cd server && npm install && cd ../client && npm install && cd ..

# 2. Build the React app
npm run build

# 3. Start the server (serves built React app + API)
npm run server:prod
```

The server will serve the optimized React build from `client/build/` on port 5000.

### Deploying to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel
```

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/build",
  "devCommand": "npm run dev",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Deploying to Heroku

```bash
# Create app
heroku create your-app-name

# Set environment
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

Create `Procfile`:

```
web: npm run server:prod
```

### GitHub Actions CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:

- Installs dependencies
- Builds the React app
- Runs tests

Customize the workflow to deploy to your hosting service.

## Troubleshooting Deployments

### Error: `react-scripts: command not found`

**Solution**: Ensure all dependencies are installed:

```bash
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Build fails with missing dependencies

**Solution**: Delete lock files and reinstall:

```bash
rm -r client/node_modules server/node_modules
rm client/package-lock.json server/package-lock.json
npm install && cd server && npm install && cd ../client && npm install
```

### Environment variables not working

Create `.env` files:

`server/.env`:

```
PORT=5000
NODE_ENV=production
USER_ID=your_user_id
EMAIL_ID=your_email
COLLEGE_ROLL_NUMBER=your_roll
```

`client/.env`:

```
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints

### POST /bfhl

Analyzes a graph provided as an array of edges.

**Request:**

```json
{
  "data": ["A->B", "B->C", "A->C"]
}
```

**Response:**

```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "you@college.edu",
  "college_roll_number": "ROLLNUMBER",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Configuration

### Update User Information

Edit `server/index.js` and update:

- `USER_ID`
- `EMAIL_ID`
- `COLLEGE_ROLL_NUMBER`

## Development

### Tech Stack

- **Backend**: Express.js, CORS, Node.js
- **Frontend**: React 18, Axios, CSS3
- **Build Tools**: react-scripts
- **Development**: Nodemon (for auto-reload)

### Adding New Features

1. Backend logic goes in `server/index.js` or separate modules
2. React components go in `client/src/components/`
3. Styles should follow the existing CSS pattern in `App.css`

## Troubleshooting

**Port already in use?**

- Backend default: 5000 (change in `server/index.js`)
- Frontend default: 3000 (set PORT environment variable)

**CORS errors?**

- Ensure backend is running on port 5000
- Check that frontend proxy is configured correctly in `client/package.json`

**Dependencies issues?**

- Delete `node_modules` and package-lock.json in both server and client
- Run `npm install` again in each directory

## License

ISC
