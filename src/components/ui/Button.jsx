import styles from "./Button.module.css";

const Button = ({ children, className, ...props }) => {
  //객체분해할당을 하고 남은 요소는 props에 전부 저장
  const classList = className.split(" "); //받은 className문자열을 " "기준으로 잘러서 배열로 리턴
  const classStyles = classList.map((cls) => {
    return styles[cls];
  });
  return (
    <button className={classStyles.join(" ")} {...props}>
      {children}
    </button>
  );
};

/*
    <button className={`${styles.btn} ${styles.danger} ${styles.sm}`}>
    {children}
    </button>
    여러 클래스명을 작성해야 할 때(btn primary 이런 양식일 때는 위처럼 써야 함)
    띄어쓰기 안 됨
    */

export default Button;
