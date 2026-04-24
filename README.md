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

```bash
npm run server:prod
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
