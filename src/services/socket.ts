import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { addMessage, setUsers } from "../store/chatSlice";
import { Message, User } from "../types";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private currentUser: User | null = null;

  private constructor() {
    this.socket = io("http://localhost:5000"); 

    this.socket.on("users", (users: User[]) => {
      store.dispatch(setUsers(users));
    });

    this.socket.on("message", (message: Message) => {
      store.dispatch(addMessage(message));
    });

    this.socket.on("connect", () => {
      console.log("Connected to server");
      if (this.currentUser) {
        this.socket?.emit("user:join", this.currentUser);
      }
    });
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(user: User): void {
    this.currentUser = user;
    if (this.socket?.connected) {
      this.socket.emit("user:join", user);
    }
  }

  sendMessage(message: Omit<Message, "id" | "timestamp">): void {
    // Emit the message to the server
    this.socket?.emit("message:send", message);

    // Dispatch the sent message to the store immediately for the sender to see it
    const timestamp = Date.now(); 
    const messageWithTimestamp = {
      ...message,
      id: `${message.senderId}-${timestamp}`,
      timestamp,
    };

    store.dispatch(addMessage(messageWithTimestamp));
  }

  disconnect(): void {
    if (this.currentUser) {
      this.socket?.emit("user:leave", this.currentUser.id);
      this.currentUser = null;
    }
  }
}

export const socketService = SocketService.getInstance();
