import { io } from 'socket.io-client';

// 1. Point to your Backend URL
// If you deploy later, this switches automatically. For now, it uses localhost:3000
const URL = import.meta.env.MODE === 'production' ? undefined : 'http://localhost:3000';

// 2. Initialize the Socket Connection
export const socket = io(URL, {
  autoConnect: false, // We connect manually in Dashboard.jsx
  auth: {
    token: localStorage.getItem('token') // Send the JWT if it exists
  }
});