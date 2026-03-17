import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    //새로고침하더라도 기억할 수 있도록 작업
    //사용할 변수를 정리
    (set) => ({
      //저장할 정보를 속성으로 생성
      memberId: null,
      memberGrade: null,
      memberThumb: null,
      token: null,
      endTime: null,

      //함수 구현(zustand로 관리할 데이터를 처리하는 함수들 구현)
      login: ({ memberId, memberGrade, memberThumb, token, endTime }) => {
        set({ memberId, memberGrade, memberThumb, token, endTime });
      },
      logout: () => {
        set({
          memberId: null,
          memberGrade: null,
          memberThumb: null,
          token: null,
          endTime: null,
        });
      },
    }),
    {
      name: "auth-key",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
