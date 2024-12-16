import React, { useState, useRef, useEffect } from 'react';
import { BsArrowRightSquareFill } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Message } from '../../types';
import { socketService } from '../../services/socket';
import { IoSend } from 'react-icons/io5'; 
import { FaPlus, FaRegFaceSmile } from "react-icons/fa6";
import { formatMessageTime } from '../../utils/dateUtils';
import { FaPhone, FaVideo, FaFileAlt } from 'react-icons/fa';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);
  const messages = useSelector((state: RootState) => state.chat.messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentUser && selectedUser) {
      socketService.sendMessage({
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: message,
      });
      setMessage('');
    }
  };

  if (!selectedUser) {
    return (
      <div className={styles.chatWindow}>
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  const chatMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUser?.id && msg.receiverId === selectedUser.id) ||
      (msg.senderId === selectedUser.id && msg.receiverId === currentUser?.id)
  );

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.userInfo}>
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className={styles.userAvatar}
          />
          <div>
            <p className={styles.userName}>{selectedUser.name}</p>
            <p className={styles.userStatus}>{selectedUser.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        {/* Icons */}
        <div className={styles.chatHeaderIcons}>
          <FaVideo className={styles.chatIcon} title="Video Call" />
          <FaPhone className={styles.chatIcon} title="Voice Call" />
          <FaFileAlt className={styles.chatIcon} title="Share" />
        </div>
      </div>

      {/* Messages */}
      <div className={styles.chatMessages}>
        {chatMessages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`${styles.chatMessage} ${
              msg.senderId === currentUser?.id
                ? styles.chatMessageOutgoing // Sent message (right-aligned)
                : styles.chatMessageIncoming // Received message (left-aligned)
            }`}
          >
            <div className={styles.messageWrapper}>
              <img
                src={msg.senderId === currentUser?.id ? currentUser.avatar : selectedUser.avatar}
                alt="User Avatar"
                className={styles.messageAvatar}
              />
              <div className={styles.messageContentWrapper}>
                <p className={styles.messageContent}>{msg.content}</p>
                <span className={styles.messageTime}>{formatMessageTime(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.chatInput}>
        <form onSubmit={handleSend} className={styles.messageForm}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className={styles.messageInput}
          />
          <FaRegFaceSmile className={styles.emojiIcon} />
          <FaPlus className={styles.plusIcon} />
          <button type="submit" className={styles.sendButton}>
            <BsArrowRightSquareFill className={styles.sendIcon} />
          </button>
        </form>
      </div>
    </div>
  );
}
