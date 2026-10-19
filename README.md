# Escape Room Platform

This project is a full-stack web application for creating and playing digital escape rooms. 
It includes both a player interface for solving rooms and a management interface for building them.

## What's Inside

* **Player Area:** Users can log in, enter the lobby, choose an escape room, and play by interacting with objects in the room, listening to audio clues, and answering riddles to advance.
* **Creator Studio (Admin/Developer):** An interface for creating and editing escape rooms.
*  It allows uploading media files (images and audio), placing interactive elements inside the room, and attaching questions to each element.
* **User Management:** Full registration and login system with protected routes and permissions.

## Architecture & Technologies

**Frontend (`/client`)**
Built with React (Vite) and styled using CSS Modules. 
The client side is organized into clear layers:
* `pages` & `components` - UI views for the game, lobby, and creator dashboard.
* `context` - Global authentication state management (`AuthContext`).
* `api` & `hooks` - Separated API calls for each entity (rooms, games, questions, assets) and a custom `useFetch` hook.

**Backend (`/server`)**
Built with Node.js and Express, following the MVC pattern:
* `controllers` & `models` - Server logic and database queries for users, rooms, room elements, questions, and active game sessions.
* `middleware` - Custom middlewares for user authentication (`authMiddleware`) and request validation (`validationMiddleware`).
* `public/assets` - Server-side storage for audio and media files used during gameplay.
