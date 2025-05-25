import React, { useEffect, useState, useRef, useCallback } from "react";
import ChatService from "../../services/ChatService";
import { useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";

const ChatWindow = ({ receiverId, onUnreadCountChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const prevScrollHeight = useRef(0);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (!isScrolledUp && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  }, [isScrolledUp]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;
      setIsScrolledUp(!isNearBottom);
      if (!isNearBottom) {
        prevScrollHeight.current = scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom();
    }
  }, [messages, isScrolledUp, scrollToBottom]);

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  useEffect(() => {
    if (user?.id && receiverId) {
      ChatService.getMessages(user.id, receiverId).then((history) => {
        setMessages(history.data);
        ChatService.markMessagesAsRead(user.id, receiverId);
        setUnreadCount(0);
      });

      ChatService.registerUser(user.id);

      ChatService.onReceiveMessage((msg) => {
        if (
          (msg.senderId === user.id && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === user.id)
        ) {
          setMessages((prev) => [...prev, msg]);
          if (msg.senderId === receiverId) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      });

      ChatService.onReceiveUnreadMessages((unreads) => {
        const filtered = unreads.filter(
          (msg) =>
            (msg.senderId === receiverId && msg.receiverId === user.id) ||
            (msg.senderId === user.id && msg.receiverId === receiverId)
        );
        setMessages((prev) => [...prev, ...filtered]);
        const count = filtered.filter(
          (msg) => msg.senderId === receiverId && !msg.isRead
        ).length;
        setUnreadCount(count);
      });
    }

    return () => {
      ChatService.socket.off("receiveMessage");
      ChatService.socket.off("receiveUnreadMessages");
    };
  }, [user, receiverId]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      senderId: user.id,
      receiverId,
      message: input,
      timestamp: new Date(),
      isRead: true,
    };
    setInput("");
    ChatService.sendMessage(newMsg);
    setUnreadCount(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  return (
    <div className="chat-container">
      <div className="messages-outer-wrapper">
        <div
          className="messages-container"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>Bắt đầu cuộc trò chuyện</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${
                  msg.senderId === user.id ? "sent" : "received"
                }`}
              >
                {msg.senderId !== user.id && (
                  <div className="avatar">
                    <BsPersonCircle size={24} />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-text">{msg.message}</div>
                  <div className="message-time">
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-area-wrapper">
        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="message-textarea"
          />
          <button onClick={handleSend} className="send-button">
            <IoSend className="send-icon" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 430px;
          background: #f8f9fa;
        }

        .messages-outer-wrapper {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #f0f2f5;
        }

        .messages-container {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty-state {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #666;
          font-size: 14px;
        }

        .message-bubble {
          display: flex;
          max-width: 80%;
          gap: 8px;
        }

        .message-bubble.sent {
          align-self: flex-end;
        }

        .message-bubble.received {
          align-self: flex-start;
        }

        .avatar {
          color: #7a7a7a;
          margin-top: 4px;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .message-text {
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .sent .message-text {
          background: #4361ee;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .received .message-text {
          background: white;
          color: #333;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message-time {
          font-size: 10px;
          color: #7a7a7a;
          padding: 0 8px;
        }

        .sent .message-time {
          text-align: right;
        }

        .received .message-time {
          text-align: left;
        }

        .input-area-wrapper {
          border-top: 1px solid #e9ecef;
          background: white;
        }

        .input-area {
          display: flex;
          align-items: flex-end;
          padding: 12px 16px;
          gap: 10px;
        }

        .message-textarea {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e9ecef;
          border-radius: 16px;
          outline: none;
          font-size: 14px;
          resize: none;
          max-height: 120px;
          overflow-y: auto;
          min-height: 40px;
          line-height: 1.4;
        }

        .message-textarea:focus {
          border-color: #4361ee;
        }

        .send-button {
          background: #4361ee;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-button:hover {
          background: #3a0ca3;
          transform: scale(1.05);
        }

        .send-icon {
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
