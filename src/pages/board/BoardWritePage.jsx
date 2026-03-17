import { useState } from "react";
import useAuthStore from "../../components/utils/useAuthStore";
import styles from "./Board.module.css";
import BoardFrm from "./BoardFrm";
import Button from "../../components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BoardWritePage = () => {
  //입력할 내용 : 제목(title), 내용(content), 작성자(writer)
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const [board, setBoard] = useState({
    boardTitle: "",
    boardContent: "",
    boardWriter: memberId,
  });
  const [files, setFiles] = useState([]);
  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };

  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  const inputBoard = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newBoard = { ...board, [name]: value };
    setBoard(newBoard);
  };
  const inputBoardContent = (data) => {
    setBoard({ ...board, boardContent: data });
  };

  const registBoard = () => {
    if (board.boardTitle === "" || board.boardContent === "") {
      return;
    }
    //파일을 포함한 요청을 서버에 보낼 때
    // -> FormData 객체를 사용(데이터를 포장해서 전송)
    const form = new FormData();
    form.append("boardTitle", board.boardTitle);
    form.append("boardContent", board.boardContent);
    form.append("boardWriter", board.boardWriter);
    files.forEach((file) => {
      form.append("files", file);
    });

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data > 0) {
          Swal.fire({ title: "게시글 작성 완료", icon: "success" });
          navigate("/board/list");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <section className={styles.board_wrap}>
      <h3 className="page-title">게시글 작성</h3>
      <BoardFrm
        board={board}
        inputBoard={inputBoard}
        files={files}
        addFiles={addFiles}
        deleteFile={deleteFile}
        inputBoardContent={inputBoardContent}
      />
      <div className={styles.btn_wrap}>
        <Button className="btn primary lg" onClick={registBoard}>
          작성하기
        </Button>
      </div>
    </section>
  );
};

export default BoardWritePage;
