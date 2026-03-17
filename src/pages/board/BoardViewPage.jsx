import { useNavigate, useParams } from "react-router-dom";
import styles from "./BoardViewPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import userImg from "../../assets/image/user.png";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";
import useAuthStore from "../../components/utils/useAuthStore";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import { TextArea } from "../../components/ui/Form";

const BoardViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const { memberId } = useAuthStore();
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

  const deleteBoard = () => {
    Swal.fire({
      title: "게시글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        //매개변수로 결과를 받고 if로 구분
        //삭제 로직은 여기에 만들면 됨.
        console.log("삭제");
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`)
          .then((res) => {
            console.log(res);
            navigate("/board/list");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    /*
    if (window.confirm("게시글을 삭제하시겠습니까??")) {
      console.log("삭제");
    } else {
      console.log("삭제안함");
    }
      */
  };

  return (
    <section className={styles.board_wrap}>
      {board && (
        <>
          <div className={styles.board_view_wrap}>
            <div className={styles.board_view_header}>
              <h2 className={styles.board_title}>{board.boardTitle}</h2>
              <div className={styles.board_sub_info}>
                <div className={styles.board_writer}>
                  <div className={styles.member_thumb}>
                    <img
                      src={board.memberThumb ? board.memberThumb : userImg}
                    ></img>
                  </div>
                  <span>{board.boardWriter}</span>
                </div>
                <div className={styles.board_date}>{board.boardDate}</div>
              </div>
            </div>
            {board.fileList.length !== 0 && ( //첨부 파일이 하나라도 있을 때 동작
              <div className={styles.file_wrap}>
                {board.fileList.map((file, index) => {
                  return <FileItem file={file} key={"file" + index} />;
                })}
              </div>
            )}
            <div
              className={styles.board_view_content}
              dangerouslySetInnerHTML={{ __html: board.boardContent }}
              // html 구조를 태그로 동작시킴(해킹 위험이 있음)
            ></div>
          </div>
          <div className={styles.board_action_wrap}>
            {memberId && memberId === board.boardWriter && (
              <div>
                <Button
                  className="btn primary"
                  onClick={() => {
                    navigate(`/board/modify/${board.boardNo}`);
                  }}
                >
                  수정
                </Button>
                <Button className="btn primary outline" onClick={deleteBoard}>
                  삭제
                </Button>
              </div>
            )}
          </div>
          <BoardCommentComponent boardNo={boardNo} />
        </>
      )}
    </section>
  );
};
const FileItem = ({ file }) => {
  const fileDownload = () => {
    //파일 다운로드
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/file/${file.boardFileNo}`,
        {
          responseType: "blob", //파일 타입을 받겠다는 의미
        },
      )
      .then((res) => {
        console.log(res);
        saveAs(res.data, file.boardFileName); //터미널에 npm install file-saver 다운로드해서 사용
      })
      .catch((err) => {
        console.log(err);
      });
  }; //파일 다운로드
  return (
    <ul className={styles.file_item} onClick={fileDownload}>
      <li>
        <InsertDriveFileIcon />
      </li>
      <li className={styles.file_name}>{file.boardFileName}</li>
      <li>
        <DownloadIcon />
      </li>
    </ul>
  );
};

const BoardCommentComponent = ({ boardNo }) => {
  const { memberId } = useAuthStore();
  const [boardCommentList, setBoardCommentList] = useState([]);
  const [boardComment, setBoardComment] = useState({
    boardCommentContent: "",
    boardCommentWriter: memberId,
    boardNo: boardNo,
  });
  useEffect(() => {
    //useEffect를 분리해서 사용해도 됨
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/comments`)
      .then((res) => {
        console.log(res);
        setBoardCommentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const registComment = ({ boardNo }) => {
    if (boardComment.boardCommentContent === "") {
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards/comments`, boardComment)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.comment_wrap}>
      {memberId && (
        <div className={styles.comment_regist_wrap}>
          <h3>댓글 등록</h3>
          <div className={styles.input_item}>
            <TextArea
              value={boardComment.boardCommentContent}
              onChange={(e) => {
                setBoardComment({
                  ...boardComment,
                  boardCommentContent: e.target.value,
                });
              }}
            ></TextArea>
            <Button className="btn primary" onClick={registComment}>
              등록
            </Button>
          </div>
        </div>
      )}
      <div className={styles.comment_list_wrap}>
        {boardCommentList.map((comment, index) => {
          return <BoardComment key={"comment-" + index} comment={comment} />;
        })}
      </div>
    </div>
  );
};

const BoardComment = ({ comment }) => {
  return (
    <ul className={styles.comment_item}>
      <li className={styles.comment_info}>
        <div className={styles.comment_writer_wrap}>
          <div>
            <img
              src={comment.memberThumb ? comment.memberThumb : userImg}
            ></img>
          </div>
          <span>{comment.boardCommentWriter}</span>
        </div>
        <span className={styles.comment_date}>{comment.boardCommentDate}</span>
      </li>
      <li className={styles.comment_content}>
        <TextArea
          value={comment.boardCommentContent}
          disabled={true}
        ></TextArea>
      </li>
    </ul>
  );
};

export default BoardViewPage;
