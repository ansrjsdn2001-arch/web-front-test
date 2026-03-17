import styles from "./BoardList.module.css";
import defaultImage from "../../assets/image/image.png";
import userImg from "../../assets/image/user.png";
import { useNavigate } from "react-router-dom";

const BoardList = ({ boardList }) => {
  return (
    <ul className={styles.board_list_wrap}>
      {boardList.map((board) => {
        return <BoardItem key={`board-list-${board.boardNo}`} board={board} />;
      })}
    </ul>
  );
};

const BoardItem = ({ board }) => {
  const navigate = useNavigate();
  return (
    <li
      className={styles.board_item}
      onClick={() => {
        navigate(`/board/view/${board.boardNo}`);
      }}
    >
      <div className={styles.board_img_wrap}>
        <img src={board.boardThumb ? board.boardThumb : defaultImage}></img>
      </div>
      <div className={styles.board_info}>
        <p className={styles.board_title}>{board.boardTitle}</p>
        <div className={styles.board_sub_info}>
          <div className={styles.board_writer}>
            <div>
              <img src={board.memberThumb ? board.memberThumb : userImg}></img>
            </div>
            <p>{board.boardWriter}</p>
          </div>
          <p>{board.boardDate}</p>
        </div>
      </div>
    </li>
  );
};

export default BoardList;
