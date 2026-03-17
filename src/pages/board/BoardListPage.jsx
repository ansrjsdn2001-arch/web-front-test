import { use, useEffect, useState } from "react";
import styles from "./Board.module.css";
import axios from "axios";
import BoardList from "../../components/board/BoardList";
import Pagination from "../../components/ui/Pagination";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";

const BoardListPage = () => {
  const navigate = useNavigate();
  const { memberId } = useAuthStore(); //로그인 되어있는 정보 중 아이디만 가져옴
  const [boardList, setBoardList] = useState([]);
  const [page, setPage] = useState(0); //최초 시작 페이지 번호
  const [size, setSize] = useState(12); //몇개의 게시물을 볼 지
  const [totalPage, setTotalPage] = useState(null);
  const [order, setOrder] = useState(1); //1 : 최신순 / 2 : 작성순

  const [type, setType] = useState(1); //1 : 제목으로 검색 / 2 : 작성자로 검색
  const [keyword, setKeyword] = useState("");

  const [searchType, setSearchType] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards?page=${page}&size=${size}&status=1&order=${order}&searchType=${searchType}&searchKeyword=${searchKeyword}`,
      )
      .then((res) => {
        console.log(res);
        setBoardList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, searchType, searchKeyword]);
  return (
    <section className={styles.board_wrap}>
      <h3 className="page-title">게시글 목록</h3>
      <div className={styles.list_option_wrap}>
        <form
          className={styles.search_wrap}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchType(type);
            setSearchKeyword(keyword);
            setPage(0); //검색할 때마다 첫 페이지로 이동할 수 있도록
          }}
        >
          <select
            className={styles.select}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option value={1}>제목</option>
            <option value={2}>작성자</option>
          </select>
          <Input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          ></Input>
          <Button type="submit" className="btn primary sm">
            검색
          </Button>
        </form>

        <select
          className={styles.select}
          value={order}
          onChange={(e) => {
            setOrder(e.target.value);
          }}
        >
          <option value={1}>최신순</option>
          <option value={2}>작성순</option>
        </select>
      </div>
      <BoardList boardList={boardList} />
      {memberId && ( //로그인을 했을 때만 글쓰기 버튼이 보이도록 하는 조건
        <div className={styles.write_btn_zone}>
          <Button
            className="btn primary"
            onClick={() => {
              navigate("/board/write");
            }}
          >
            글쓰기
          </Button>
        </div>
      )}
      <div className={styles.board_list_pagination}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPage={totalPage}
          naviSize={5}
        />
      </div>
    </section>
  );
};

export default BoardListPage;
