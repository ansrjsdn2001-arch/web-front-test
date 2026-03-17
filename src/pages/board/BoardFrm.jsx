import { Input, TextArea } from "../../components/ui/Form";
import styles from "./BoardFrm.module.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import TextEditor from "../../components/ui/TextEditor";
const BoardFrm = ({
  board,
  inputBoard,
  files,
  addFiles,
  deleteFile,
  inputBoardContent,
  addDeleteFileList,
}) => {
  console.log(files);
  return (
    <div className={styles.board_frm_wrap}>
      <div className={styles.input_wrap}>
        <label htmlFor="boardTitle">제목</label>
        <Input
          type="text"
          name="boardTitle"
          id="boardTitle"
          value={board.boardTitle}
          onChange={inputBoard}
        />
      </div>
      <div className={styles.input_wrap}>
        <label htmlFor="files">첨부파일</label>
        <label htmlFor="files" className={styles.file_btn}>
          파일 추가
        </label>
        <input
          type="file"
          id="files"
          onChange={(e) => {
            //e.target.files -> 선택한 파일들을 FileList객체로 반환(배열과 유사하지만 배열은 아님)
            // -> 배열로 변환해서 사용
            const fileList = Array.from(e.target.files);
            addFiles(fileList);
            // -> 파일을 추가로 고르면 이전 파일 목록이 사라지지 않고 누적됨(기존 배열에 새로운 배열을 넣음)
          }}
          multiple //여러 파일을 한번에 선택하기 위해서 추가
          style={{ display: "none" }}
        ></input>
        <div className={styles.file_wrap}>
          {board.fileList && //조건문 : 파일리스트가 있을 때만 동작
            board.fileList.map((file, index) => {
              //기존 파일
              return (
                <FileItem
                  key={"old-file-item-" + index}
                  file={file}
                  deleteFile={addDeleteFileList}
                ></FileItem>
              );
            })}
          {files.map((file, index) => {
            //새 파일
            return (
              <FileItem
                key={"file-item-" + index}
                file={file}
                deleteFile={deleteFile}
              ></FileItem>
            );
          })}
        </div>
      </div>

      <div className={styles.input_wrap}>
        <label htmlFor="boardContent">내용</label>
        <TextEditor
          data={board.boardContent}
          setData={inputBoardContent}
        ></TextEditor>
      </div>
    </div>
  );
};

const FileItem = ({ file, deleteFile }) => {
  return (
    <ul cl ssName={styles.file_item}>
      <li>
        <InsertDriveFileIcon />
        {/*아이콘*/}
      </li>
      <li className={styles.file_name}>{file.name || file.boardFileName}</li>
      <li>
        <CloseIcon
          className={styles.file_delete}
          onClick={() => {
            deleteFile(file); //파일을 가지고 있으면 동작
          }}
        />
      </li>
    </ul>
  );
};

export default BoardFrm;
