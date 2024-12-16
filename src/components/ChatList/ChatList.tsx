import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../../store/chatSlice';
import { RootState } from '../../store';
import { User } from '../../types';
import styles from './ChatList.module.css';

export default function ChatList() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.chat.users);
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);

  const filteredUsers = users.filter(user => user.id !== currentUser?.id);

  return (
    <div className={styles.chatList}>
      {filteredUsers.map((user: User) => (
        <div
          key={user.id}
          onClick={() => dispatch(setSelectedUser(user))}
          className={`${styles.chatItem} ${selectedUser?.id === user.id ? styles.chatItemSelected : ''}`}
        >
          <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
          <div className={styles.userInfo}>
            <p
              className={`${styles.userName} ${selectedUser?.id === user.id ? styles.userNameSelected : ''}`}
            >
              {user.name}
            </p>
            <p
              className={`${styles.userStatus} ${selectedUser?.id === user.id ? styles.userStatusSelected : ''}`}
            >
              {user.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
