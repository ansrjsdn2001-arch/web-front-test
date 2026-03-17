import styles from "./Mypage.module.css";
import { useEffect, useState } from "react";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Mypage = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const { memberId } = useAuthStore();
  console.log(memberId);
  if (memberId === null) {
    Swal.fire({
      title: "로그인 필요",
      text: "로그인 후 이용 가능합니다.",
      icon: "warning",
    }).then(() => {
      navigate("/member/login");
    });
    return;
  }
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {})
      .catch((err) => {});
  }, []);

  return (
    <section>
      <h3 className="page-title">마이페이지</h3>
    </section>
  );
};

export default Mypage;
