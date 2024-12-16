import { FaUser, FaTh, FaCog,FaPowerOff } from 'react-icons/fa'; 
import { HiMenuAlt2 } from "react-icons/hi";
import { BiMessageSquareMinus } from "react-icons/bi";

import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={`${styles.icon}`}>
        <FaPowerOff className={styles.iconSvg} /> 
      </div>
      <div className={`${styles.icon}`}>
        <BiMessageSquareMinus className={styles.iconSvg} /> 
      </div>
      <div className={styles.icon}>
        <FaUser className={styles.iconSvg} /> 
      </div>
      <div className={styles.icon}>
        <FaTh className={styles.iconSvg} /> 
      </div>
      <div className={`${styles.icon} ${styles.iconBottom}`}>
        <FaCog className={styles.iconSvg} /> 
      </div>
      <div className={`${styles.icon}`}>
        <HiMenuAlt2 className={styles.iconSvg} />
        </div>
    </div>
  );
};

export default Sidebar;
