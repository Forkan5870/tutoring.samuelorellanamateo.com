# Tutoring App - Old README

## Introduction

This repository is a project I am working on to learn more about React and Node.js. The project is a tutoring app where students can find tutors and schedule classes.

## Available Scripts

### Frontend (React)

In the project directory, you can run:

#### `npm start`

This command runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes.
You may also see any lint errors in the console.

Check the file `\src\App.js` to see the routes.

### Backend (Node.js)

If you navigate to `\server`, you can run:

#### `npm run dev`

This command runs the server in the development mode.
Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

I am aware that the server should not be inside the frontend, but I did it this way because I learned React first and then Node.js. I will change this in the future.

## .env File

To use a database, you need to create a `.env` file in the root directory of the project and add the following:

```CONNECT_DB=your_mongoDB_connection_string```
