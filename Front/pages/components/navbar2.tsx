import { useAuth } from '@/contexts/AuthContext';
import { kakaoInit } from '@/utils/kakao/kakaoinit';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useContext } from 'react';

export default function NavBar() {
  const router = useRouter();
  const { state, login, logout } = useAuth();
  const userName = state.userName;

  console.log(`navbar2: ${userName}`);

  const handleLogout = () => {
    const kakao = kakaoInit();
    if (kakao && kakao.Auth.getAccessToken()) {
      kakao.Auth.logout();
    }
    logout();
    alert('로그아웃 되었습니다.');
    router.replace('/');
  };

  return (
    <>
      <nav className="bg-white shadow-md dark:bg-gray-800">
        <div className="container mx-auto flex items-center justify-between px-6 py-2">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-800 dark:text-white"
          >
            <img
              src="/maco_logo.jpg"
              alt="アグリート"
              className="w-16 md:w-20 lg:w-24"
            />
          </Link>
          <div className="block lg:hidden">
            <button className="navbar-toggler">
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
          <div className="hidden items-center lg:flex">
            <ul className="flex items-center space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-800 hover:text-blue-600 dark:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 hover:text-blue-600 dark:text-white"
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  href="/dashboard/manualcontrol"
                  className="text-gray-800 hover:text-blue-600 dark:text-white"
                >
                  Controller
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-800 hover:text-blue-600 dark:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/statistic"
                  className="text-gray-800 hover:text-blue-600 dark:text-white"
                >
                  Statistic
                </Link>
              </li>
              <li>
                <Link
                  href="/boards/main"
                  className="text-gray-800 hover:text-blue-600 dark:text-white"
                >
                  QnA
                </Link>
              </li>
              <li>
                {userName ? (
                  <>
                    <div className="text-gray-800 dark:text-white">{`Hello, ${userName}`}</div>
                    <button
                      onClick={handleLogout}
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    로그인
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
