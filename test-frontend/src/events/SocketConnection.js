import io from "socket.io-client";

const ENDPOINT = "http://localhost:7453/test";

const socket = io(ENDPOINT, {
  transports: ["websocket"],
  secure:false,
});

socket.on('connect', () => {
  console.log(socket.id+' connected '+socket.connected); 
});
export default socket;