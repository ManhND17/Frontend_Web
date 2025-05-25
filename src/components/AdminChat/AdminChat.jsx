import React, { useEffect, useState, useRef } from "react";
import { Input, Avatar } from "antd";
import { SendOutlined, MessageOutlined } from "@ant-design/icons";
import AdminChatService from "../../services/ChatService";
import { getNameAvatar } from "../../services/UserService";
import "./AdminChat.css";

const adminId = "67da428b257437ec5b528d3f";

const AdminChat = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const messageEndRef = useRef(null);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await getNameAvatar(userId);
      if (response.status === "OK" && response.data) {
        setUserInfo((prev) => ({
          ...prev,
          [userId]: {
            name: response.data.name,
            avatar: response.data.avatar, // Đã có base64 prefix
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Fallback nếu có lỗi
      setUserInfo((prev) => ({
        ...prev,
        [userId]: {
          name: userId, // Dùng ID làm fallback
          avatar: null,
        },
      }));
    }
  };

  const fetchContacts = async () => {
    const res = await AdminChatService.getConversations(adminId);
    setContacts(res.data);
    res.data.forEach((userId) => fetchUserInfo(userId));
  };

  useEffect(() => {
    AdminChatService.registerUser(adminId);

    AdminChatService.onReceiveMessage((message) => {
      if (message.senderId === selectedUser) {
        setMessages((prev) => [...prev, message]);
        AdminChatService.markMessagesAsRead(adminId, selectedUser);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
      }
    });

    AdminChatService.onReceiveUnreadMessages((msgs) => {
      const counts = {};
      msgs.forEach((m) => {
        counts[m.senderId] = (counts[m.senderId] || 0) + 1;
      });
      setUnreadCounts(counts);
    });

    fetchContacts();

    return () => {
      AdminChatService.socket.off("receiveMessage");
      AdminChatService.socket.off("receiveUnreadMessages");
    };
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      AdminChatService.getMessages(adminId, selectedUser).then((res) => {
        setMessages(res.data);
        AdminChatService.markMessagesAsRead(adminId, selectedUser);
        setUnreadCounts((prev) => {
          const updated = { ...prev };
          delete updated[selectedUser];
          return updated;
        });
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg = {
      senderId: adminId,
      receiverId: selectedUser,
      message: newMessage,
      createdAt: new Date(),
    };

    AdminChatService.sendMessage(newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (selectedUser && !userInfo[selectedUser]) {
      fetchUserInfo(selectedUser);
    }
  }, [selectedUser]);
  return (
    <div className="admin-chat-container">
      {/* Sidebar liên hệ */}
      <div className="chat-sidebar">
        <div className="text-lg font-semibold mb-4">Danh sách liên hệ</div>
        <div className="space-y-2">
          {contacts.map((userId) => {
            const user = userInfo[userId] || { name: userId, avatar: null };
            return (
              <div
                key={userId}
                onClick={() => {
                  setSelectedUser(userId);
                }}
                className={`contact-item flex items-center p-3 hover:bg-gray-100 ${
                  selectedUser === userId ? "bg-blue-50" : ""
                }`}
              >
                <Avatar src={user.avatar} size={32}>
                  {user.name.charAt(0)}
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                </div>
                {unreadCounts[userId] > 0 && (
                  <span className="unread-count">
                    {unreadCounts[userId] > 99 ? "99+" : unreadCounts[userId]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Khung chat chính */}
      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              {selectedUser && (
                <>
                  <Avatar
                    src={userInfo[selectedUser]?.avatar}
                    size={40}
                    style={{ backgroundColor: "#1890ff", color: "#fff" }}
                  >
                    {userInfo[selectedUser]?.name?.charAt(0) ||
                      selectedUser.charAt(0)}
                  </Avatar>
                  <div className="user-info">
                    <div className="user-name">
                      {userInfo[selectedUser]?.name || selectedUser}
                    </div>
                    <div className="user-status">Đang hoạt động</div>
                  </div>
                </>
              )}
            </div>

            <div className="chat-body">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${
                    msg.senderId === adminId ? "admin" : ""
                  }`}
                >
                  <div className="message-content">{msg.message}</div>
                  <div className="message-time text-xs mt-1 opacity-70">
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="chat-input">
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 3 }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="flex-1"
              />
              <SendOutlined className="send-icon" onClick={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <MessageOutlined className="text-4xl mb-2" />
            <p>Chọn một người để bắt đầu trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
