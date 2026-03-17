import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./font.css";
import Header from "./components/commons/header";
import Footer from "./components/commons/Footer";
import Main from "./pages/Main";
import Join from "./pages/member/join";
import Login from "./pages/member/login";
import { useEffect, useState } from "react";
import Mypage from "./pages/member/mypage";
import useAuthStore from "./components/utils/useAuthStore";
import axios from "axios";
import BoardListPage from "./pages/board/BoardListPage";
import BoardWritePage from "./pages/board/BoardWritePage";
import BoardViewPage from "./pages/board/BoardViewPage";
import BoardModifyPage from "./pages/board/BoardModifyPage";

function App() {
  const { endTime, token } = useAuthStore();
  const logout = () => {
    useAuthStore.getState().logout();
    delete axios.defaults.headers.common["Authorization"];
  };
  useEffect(() => {
    if (endTime === null) {
      return;
    }
    const timeout = endTime - Date.now();
    if (timeout > 0) {
      axios.defaults.headers.common["Authorization"] = token;
      window.setTimeout(() => {
        logout();
      }, timeout);
    } else {
      logout();
    }
  }, [endTime]);
  return (
    <div className="wrap">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/member/join" element={<Join />} />
          <Route path="/member/login" element={<Login />} />
          <Route path="/member/mypage" element={<Mypage />} />
          <Route path="/board/list" element={<BoardListPage />} />
          <Route path="/board/write" element={<BoardWritePage />} />
          <Route path="/board/view/:boardNo" element={<BoardViewPage />} />
          <Route path="/board/modify/:boardNo" element={<BoardModifyPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
