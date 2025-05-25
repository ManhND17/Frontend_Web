import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3001", {
  withCredentials: true,
});

const registerUser = (userId) => {
  socket.emit("registerUser", userId);
};

const sendMessage = (data) => {
  socket.emit("sendMessage", data);
};

const onReceiveMessage = (callback) => {
  socket.on("receiveMessage", callback);
};

const onReceiveUnreadMessages = (callback) => {
  socket.on("receiveUnreadMessages", callback);
};

const onUpdateUserStatus = (callback) => {
  socket.on("updateUserStatus", callback);
};

const disconnect = () => {
  socket.disconnect();
};

const getMessages = (user1Id, user2Id) => {
  return axios.get(`http://localhost:3001/api/messages/${user1Id}/${user2Id}`, {
    withCredentials: true,
  });
};

const markMessagesAsRead = (userId, senderId) => {
  return axios.post(
    "http://localhost:3001/api/messages/mark-read",
    { userId, senderId },
    { withCredentials: true }
  );
};

const markMessagesByIds = (messageIds) => {
  return axios.post(
    "http://localhost:3001/api/messages/read",
    { messageIds },
    { withCredentials: true }
  );
};

const getConversations = (userId) => {
  return axios.get(`http://localhost:3001/api/conversations/${userId}`, {
    withCredentials: true,
  });
};

export default {
  socket,
  registerUser,
  sendMessage,
  onReceiveMessage,
  onReceiveUnreadMessages,
  onUpdateUserStatus,
  disconnect,
  getMessages,
  markMessagesAsRead,
  markMessagesByIds,
  getConversations,
};
