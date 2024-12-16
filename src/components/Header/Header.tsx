import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaSearch } from "react-icons/fa"; // Importing the search icon from react-icons
import styles from "./Header.module.css"; // Add your header-specific styles here

const Header = () => {
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);

  if (!currentUser) {
    return null; // If no user is logged in, don't render the header
  }

  return (
    <div className={styles.header}>
      {/* Left side: Search bar */}
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} /> {/* React Icon used here */}
        <input
          type="text"
          placeholder="Search contacts, messages"
          className={styles.searchInput}
        />
      </div>

      {/* Right side: Profile */}
      <div className={styles.profileContainer}>
        {/* Profile Info */}
        <div className={styles.profileInfo}>
          <p className={styles.profileName}>{currentUser.name}</p>
          <p className={styles.profileStatus}>
            {currentUser.online && <span className={styles.onlineDot}></span>}
            {currentUser.online ? "Online" : "Offline"}
          </p>
        </div>

        {/* Profile Avatar */}
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className={styles.profileAvatar}
        />
      </div>
    </div>
  );
};

export default Header;
