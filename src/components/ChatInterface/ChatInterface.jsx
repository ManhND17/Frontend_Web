import React, { useState, useEffect } from "react";
import ChatWindow from "../ChatBox/ChatBox";
import { useSelector } from "react-redux";
import { FaCommentDots, FaTimes, FaMinus } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.user);

  const ADMIN_ID = "67da428b257437ec5b528d3f";

  const handleUnreadCountChange = (count) => {
    setUnreadCount(count);
  };

  if (!user || !user.id) return null;

  return (
    <div className="chat-interface-container">
      {/* Floating Chat Button */}
      <div 
        className={`floating-chat-button ${isOpen ? 'active' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) {
            // Khi đóng chat, reset unread count
            setUnreadCount(0);
          }
        }}
      >
        {isOpen ? <FaTimes /> : <FaCommentDots />}
        {unreadCount > 0 && !isOpen && (
          <div className="unread-badge">{unreadCount}</div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Chat Header */}
          <div className="chat-header" onClick={() => setIsMinimized(!isMinimized)}>
            <div className="chat-title">Chat với Cửa hàng</div>
            <div className="chat-controls">
              <button 
                className="control-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
              >
                <FaMinus />
              </button>
              <button 
                className="control-button close-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="chat-content">
              <ChatWindow 
                receiverId={ADMIN_ID} 
                key={user.id}
                onUnreadCountChange={handleUnreadCountChange}
                sendButton={(handleSend) => (
                  <button className="send-button" onClick={handleSend}>
                    <IoSend className="send-icon" />
                  </button>
                )}
                inputPlaceholder="Nhập tin nhắn..."
              />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .chat-interface-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .floating-chat-button {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4361ee, #3a0ca3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(67, 97, 238, 0.3);
          transition: all 0.3s ease;
          font-size: 24px;
        }
        
        .floating-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(67, 97, 238, 0.4);
        }
        
        .floating-chat-button.active {
          background: linear-gradient(135deg, #f72585, #b5179e);
        }
        
        .unread-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f72585;
          color: white;
          font-size: 12px;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 25px;
          width: 350px;
          height: 500px;
          max-height: 70vh;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .chat-window.minimized {
          height: 50px;
        }
        
        .chat-header {
          background: linear-gradient(135deg, #4361ee, #3a0ca3);
          color: white;
          padding: 15px 20px;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        
        .chat-title {
          flex: 1;
        }
        
        .chat-controls {
          display: flex;
          gap: 10px;
        }
        
        .control-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .close-button:hover {
          background: rgba(255, 0, 0, 0.6);
        }
        
        .chat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
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

export default ChatInterface;