import { useNavigate, useParams } from "react-router-dom";
import styles from "./Board.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import BoardFrm from "./BoardFrm";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";

const BoardModifyPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const [board, setBoard] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [files, setFiles] = useState([]);
  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };
  const inputBoard = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newBoard = { ...board, [name]: value };
    setBoard(newBoard);
  };
  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  const inputBoardContent = (data) => {
    setBoard({ ...board, boardContent: data });
  };
  //수정 전에 이미 올라가 있는 파일 중 수정 시 지우고 싶은 파일의 목록을 저장
  const [deleteFileList, setDeleteFileList] = useState([]);
  const addDeleteFileList = (file) => {
    //화면에서 기존 파일을 없애는 작업 -> board.fileList를 변환
    const newFileList = board.fileList.filter((item) => {
      return item !== file;
    });
    setBoard({ ...board, fileList: newFileList });
    //삭제할 파일을 추가(boardFilePath를 추가)
    setDeleteFileList([...deleteFileList, file.boardFilePath]);
  };
  const modifyBoard = () => {
    const form = new FormData();
    form.append("boardTitle", board.boardTitle);
    form.append("boardContent", board.boardContent);
    files.forEach((file) => {
      form.append("files", file);
    });
    deleteFileList.forEach((boardFilePath) => {
      form.append("deleteFilePath", boardFilePath);
    });
    axios
      .put(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({ title: "게시글 수정 완료", icon: "success" });
        navigate("/board/list");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <section className={styles.board_wrap}>
      <h3 className="page-title">게시글 수정</h3>
      {board && (
        <BoardFrm
          board={board}
          inputBoard={inputBoard}
          files={files}
          addFiles={addFiles}
          deleteFile={deleteFile}
          inputBoardContent={inputBoardContent}
          addDeleteFileList={addDeleteFileList}
        />
      )}
      <div className={styles.btn_wrap}>
        <Button className="btn primary lg" onClick={modifyBoard}>
          수정하기
        </Button>
      </div>
    </section>
  );
};
//수정은 기존에 입력 되어있는 정보를 가져와서 수정해야 하다보니 입력폼과 유사하다
export default BoardModifyPage;
