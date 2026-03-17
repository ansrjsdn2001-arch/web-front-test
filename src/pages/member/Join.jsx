import { useEffect, useState } from "react";
import { TextArea } from "../../components/ui/Form";
import { Input } from "../../components/ui/Form";
import styles from "./join.module.css";
import Button from "../../components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Join = () => {
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberEmail: "",
  });

  const navigate = useNavigate();
  const [memberPwRe, setMemberPwRe] = useState("");

  const inputMember = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };

  //아이디 중복 체크용 state(0 : 중복 검사 전 / 1 : 아이디 중복 / 2 : 사용 가능)
  const [checkId, setCheckId] = useState(0);

  const idDupCheck = () => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members/exists?memberId=${member.memberId}`,
      )
      .then((res) => {
        console.log(res);
        if (res.data) {
          setCheckId(2);
        } else {
          setCheckId(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const pwDupCheck = () => {
    if (member.memberPw === memberPwRe) {
      setCheckPw(1);
    } else {
      setCheckPw(2);
    }
  };

  const joinMember = () => {
    console.log(member);
    if (
      checkId !== 2 ||
      checkPw !== 1 ||
      mailAuth !== 3 ||
      member.memberName === ""
    ) {
      Swal.fire({
        title: "입력값을 확인하세요!",
        icon: "error",
      });
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members`, member)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          //로그인 페이지로 이동
          navigate("/member/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //패스워드 확인용 state -> 0 : 검사 전/ 1 : 패스워드 일치 / 2 : 패스워드 불일치
  const [checkPw, setCheckPw] = useState(0);

  //이메일 인증 상태 관리용
  //0 : 메일 전송 버튼 누르기 전, 1 : 메일 전송 버튼 누른 후(코드 받기 전), 2 : 메일 전송 버튼 누른 후(코드 받은 후), 3 : 인증 완료
  const [mailAuth, setMailAuth] = useState(0);
  //이메일 인증코드 저장용
  const [mailAuthCode, setMailAuthCode] = useState(null);
  //이메일 인증 input용 state
  const [mailAuthInput, setMailAuthInput] = useState("");

  //이메일 인증 시간 처리를 위한 state
  const [time, setTime] = useState(180); //인증 유효를 3분으로 하기 위해서 180초 처리를 위한 값으로 설정
  const [timeout, setTimeout] = useState(null); //유효 시간 안에 인증이 완료되면 시간이 줄어드는 함수를 멈추기 위한 값

  const sendMail = () => {
    setTime(180);
    if (timeout) {
      window.clearInterval(timeout);
    }
    setMailAuth(1);
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-verification`, {
        memberEmail: member.memberEmail,
      })
      .then((res) => {
        console.log(res);
        setMailAuthCode(res.data);
        setMailAuth(2);
        const intervalId = window.setInterval(() => {
          //setState(() => {})
          // -> setState함수의 매개변수로 함수를 사용하면 해당 함수의 첫번째 매개변수가 돌아가는 시점의 state값
          setTime((prev) => {
            return prev - 1;
          });
          //setTime(time - 1); 비슷해 보이지만 완전 다른 코드
          //지금은 시간이 0이 되어도 -1 음수로 넘어감
        }, 1000);
        setTimeout(intervalId);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (time === 0) {
      window.clearInterval(timeout); //시간이 다 되면 시간을 줄이는 interval함수 종료
      setMailAuthCode(null); //발급된 인증코드 파기
      setTimeout(null);
    }
  }, [time]);
  const showTime = () => {
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, "0"); //문자열은 반드시 2자리이고 남는 공간은 오른쪽 값으로 채운다.
    console.log(time);
    return `${min}:${sec}`;
  };

  return (
    <section className={styles.join_wrap}>
      <h3 className="page-title">회원가입</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          joinMember();
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
            onBlur={idDupCheck}
          />
          {checkId > 0 && (
            <p
              className={
                checkId === 2
                  ? styles.check_msg
                  : styles.check_msg + " " + styles.invalid
              }
            >
              {checkId == 2
                ? "사용 가능한 아이디입니다."
                : "이미 사용 중인 아이디입니다."}
            </p>
          )}
        </div>

        <div className={styles.input_wrap}>
          <label htmlFor="memberPw">비밀번호</label>
          <Input
            type="password"
            name="memberPw"
            id="memberPw"
            value={member.memberPw}
            onChange={inputMember}
          />
        </div>

        <div className={styles.input_wrap}>
          <label htmlFor="memberPwRe">비밀번호 확인</label>
          <Input
            type="password"
            name="memberPwRe"
            id="memberPwRe"
            value={memberPwRe}
            onChange={(e) => {
              setMemberPwRe(e.target.value);
            }}
            onBlur={pwDupCheck}
          />
          {checkPw > 0 && (
            <p
              className={
                checkPw === 1
                  ? styles.check_msg
                  : styles.check_msg + " " + styles.invalid
              }
            >
              {checkPw === 1
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        <div className={styles.input_wrap}>
          <label htmlFor="memberName">이름</label>
          <Input
            type="text"
            name="memberName"
            id="memberName"
            value={member.memberName}
            onChange={inputMember}
          />
        </div>

        <div className={styles.input_wrap}>
          <label htmlFor="memberEmail">이메일</label>
          <div className={styles.input_item}>
            <Input
              type="text"
              name="memberEmail"
              id="memberEmail"
              value={member.memberEmail}
              onChange={inputMember}
              readOnly={mailAuth === 1 || mailAuth === 3}
            />
            <Button
              type="button"
              className="btn primary sm"
              onClick={sendMail}
              readOnly={mailAuth === 1 || mailAuth === 3}
            >
              메일전송
            </Button>
          </div>
        </div>
        {mailAuth > 1 && ( //메일을 받았을 때만 나타날 수 있도록 해줌
          <div className={styles.input_wrap}>
            <label className="mailAuthInput">이메일 확인</label>
            <div className={styles.input_item}>
              <Input
                type="text"
                name="mailAuthInput"
                id="mailAuthInput"
                value={mailAuthInput}
                onChange={(e) => {
                  setMailAuthInput(e.target.value);
                }}
                disabled={mailAuth === 3}
              ></Input>
              <Button
                className="btn primary sm"
                type="button"
                onClick={() => {
                  if (mailAuthCode === mailAuthInput) {
                    setMailAuth(3);
                    window.clearInterval(timeout); //인증이 잘 되었다면 여기도 시간을 멈춤
                    //이 코드를 작성하지 않아도 보는 입장에서는 시간이 멈춘 것으로 보이지만 랜더링은 계속 돌고 있다.
                    setTimeout(null);
                  } else {
                    alert("인증코드가 올바르지 않습니다.");
                  }
                }}
              >
                인증하기
              </Button>
            </div>
            <p className={styles.check_msg}>
              {mailAuth === 3 ? "인증되었습니다." : showTime()}
              {/*3이면 인증되었습니다. 아니면 시간이 감*/}
            </p>
          </div>
        )}
        <div className={styles.member_button_wrap}>
          <Button type="submit" className="btn primary lg">
            회원가입
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Join;
