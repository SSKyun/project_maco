import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { kakaoInit } from '@/utils/kakao/kakaoinit';

interface AuthState {
  isLoggedIn: boolean;
  userName: string | null;
}

interface AuthAction {
  type: 'LOGIN' | 'LOGOUT';
  payload?: string;
}

const AuthContext = createContext<{
  state: AuthState;
  login: (userName: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}>({
  state: {
    isLoggedIn: false,
    userName: null,
  },
  login: () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

const initialState = {
  isLoggedIn: false,
  userName: null,
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        userName: action.payload || null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        userName: null,
      };
    default:
      throw new Error('Invalid action type');
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 로그인 처리
  const login = useCallback((userName: string) => {
    localStorage.setItem('name', userName);
    localStorage.setItem(
      'expirationTime',
      (Date.now() + 60 * 60 * 1000).toString()
    );
    dispatch({ type: 'LOGIN', payload: userName });
  }, []);

  // 로그아웃 처리
  const logout = useCallback(() => {
    // 카카오 로그아웃 처리
    const kakao = kakaoInit();
    if (kakao && kakao.Auth.getAccessToken()) {
      kakao.Auth.logout();
    }

    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('name');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expirationTime');

    // 상태 업데이트
    dispatch({ type: 'LOGOUT' });
  }, []);

  // 초기 상태 설정
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const expirationTime = localStorage.getItem('expirationTime');

    if (storedName && expirationTime) {
      const currentTime = Date.now();
      const timeLeft = Number(expirationTime) - currentTime;

      if (timeLeft > 0) {
        login(storedName);
        console.log('토큰 유효함으로 로그인 처리');
      } else {
        alert('로그인 시간이 만료되었습니다. 다시 로그인하세요.');
        logout();
        console.log('토큰 만료로 로그아웃 처리');
      }
    }
  }, [login, logout]);

  const isAuthenticated = useCallback(() => {
    return state.isLoggedIn;
  }, [state.isLoggedIn]);

  return (
    <AuthContext.Provider value={{ state, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
