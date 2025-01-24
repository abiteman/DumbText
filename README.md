# DumbText

A stupid simple, no auth, no storage, text formatter. Format your text in various cases with a clean, modern interface.

## Features

- Multiple text case formatting options:
  - Sentence case
  - lowercase
  - UPPERCASE
  - Capitalize Words
  - Title Case
  - Numeric conversion
- Copy formatted text to clipboard
- Download formatted text as .txt file
- Dark mode support
- Responsive design
- Docker support

## Running Locally

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open http://localhost:3000 in your browser

## Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t dumbtext .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 dumbtext
   ```
3. Open http://localhost:3000 in your browser

## Development

To run the application in development mode with auto-reload:

```bash
npm run dev
```

```bash
npm run convert-logo
``` 