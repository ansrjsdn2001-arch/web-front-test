import { Link, useNavigate } from "react-router-dom";
import styles from "./Commons.module.css";
import Button from "../ui/Button";
import useAuthStore from "../utils/useAuthStore";
import userImg from "../../assets/image/user.png";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const login = useAuthStore();
  const memberId = login.memberId;
  const memberThumb = login.memberThumb;
  return (
    <header className={styles.header}>
      <div>
        <div className={styles.site_logo}>
          <Link to="/">HELLO WORLD</Link>
        </div>
        <ul className={styles.nav}>
          <li>
            <Link to="/board/list">게시판</Link>
            {/*목록 출력*/}
          </li>
          <li>
            <Link to="#">메뉴2</Link>
          </li>
          <li>
            <Link to="#">메뉴3</Link>
          </li>
        </ul>
        <div className={styles.member_link_zone}>
          {memberId ? (
            <>
              <div className={styles.member_info}>
                <div
                  onClick={() => {
                    navigate("/member/mypage");
                  }}
                >
                  {memberThumb ? "" : <img src={userImg} />}
                </div>
              </div>
              <Button
                className="btn primary outline login"
                onClick={() => {
                  useAuthStore.getState().logout();
                  delete axios.defaults.headers.common["Authorization"];
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                className="btn primary login"
                onClick={() => {
                  navigate("/member/login");
                }}
              >
                로그인
              </Button>
              <Button
                className="btn primary outline login"
                onClick={() => {
                  navigate("/member/join");
                }}
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
