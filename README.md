# Teleparty Chat App Assignment

A real-time chat application built with **React** and **TypeScript**, simulating a simplified Teleparty chat experience. Users can create or join chat rooms, send messages, see typing presence, and optionally set a user icon.

## Live Demo

[https://NehaMD.github.io/teleparty-chat-app-assignment/](https://NehaMD.github.io/teleparty-chat-app-assignment/)

## Features

- **Create & Join Chat Rooms:** Start a new chat or join an existing one using a Room ID.  
- **Real-Time Messaging:** Messages appear instantly using WebSocket communication.  
- **Typing Indicators:** See when you or other users are typing.  
- **Optional User Icons:** Users can set a display avatar in the chat.  
- **Clean UI:** Responsive, and readable interface for ease of use.

## Key Technical Highlights

- **WebSocket Integration:** Implemented a custom hook (`useTeleparty`) to handle WebSocket connections using the `teleparty-websocket-lib` library.  
- **Session Management:** Users can create or join chat rooms. Previous chat history is loaded when joining a session.    
- **State Management:** Used React `useState` and `useRef` hooks for managing messages, connection state, and typing users.  
- **Dynamic UI Updates:** Messages and typing presence update live without page refresh.  
- **User Customization:** Optional user icons/avatar support when creating or joining a room.

## Technologies

- **teleparty-websocket-lib** – WebSocket library for real-time communication
- **React** – Frontend UI library  
- **TypeScript** – Type safety and maintainability  
- **Vite** – Fast development and build tool  
- **GitHub Pages** – Hosting the live application

## Installation & Development

1. Clone the repository:

```bash
git clone https://github.com/NehaMD/teleparty-chat-app-assignment.git
cd teleparty-chat-app-assignment

