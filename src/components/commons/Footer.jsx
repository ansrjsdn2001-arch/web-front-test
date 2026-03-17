import { Link } from "react-router-dom";
import styles from "./Commons.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <ul>
          <li>
            <Link to="#">이용약관</Link>
          </li>
          <li>
            <Link to="#">개인정보취급방침</Link>
          </li>
          <li>
            <Link to="#">인재채용</Link>
          </li>
          <li>
            <Link to="#">제휴문의</Link>
          </li>
          <li>
            <Link to="#">인스타그램</Link>
          </li>
        </ul>

        <p>Made by moon goun woo</p>
        <p>KH 정보교육원 수업 자료입니다. 무단 복제를 허용하지 않습니다.</p>
      </div>
    </footer>
  );
};

export default Footer;
