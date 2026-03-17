import { useState } from "react";
import styles from "./Join.module.css";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../components/utils/useAuthStore";

const Login = () => {
  const [member, setMember] = useState({ memberId: "", memberPw: "" });
  const navigate = useNavigate();
  const inputMember = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };
  const login = () => {
    if (member.memberId === "" || member.memberPw === "") {
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/login`, member)
      .then((res) => {
        console.log(res);
        useAuthStore.getState().login(res.data);
        axios.defaults.headers.common["Authorization"] = res.data.token;
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "로그인 실패",
          text: "아이디 또는, 비밀번호를 확인하세요.",
          icon: "error", //spring boot에서 강제로 에러를 발생시킴
        });
      });
  };
  return (
    <section className={styles.join_wrap}>
      <h3 className="page-title">로그인</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        autoComplete="off"
      >
        <div className={styles.input_wrap}>
          <label htmlFor="memberId">아이디</label>
          <Input
            type="text"
            name="memberId"
            id="memberId"
            value={member.memberId}
            onChange={inputMember}
          ></Input>
        </div>
        <div className={styles.input_wrap}>
          <label htmlFor="memberPw">비밀번호</label>
          <Input
            type="password"
            name="memberPw"
            id="memberPw"
            value={member.memberPw}
            onChange={inputMember}
          ></Input>
        </div>
        <div className={styles.member_button_wrap}>
          <Button className="btn primary lg" type="submit">
            로그인
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Login;
