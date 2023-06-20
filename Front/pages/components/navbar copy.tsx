import { useAuth } from '@/contexts/AuthContext';
import { kakaoInit } from '@/utils/kakao/kakaoinit';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 40px;
  height: 100vh;
  width: 100px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  z-index: 1;
`;

const Logo = styled.img`
  height: 50px;
  width: 50px;
  object-fit: contain;
`;

const NavLinks = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 30px 0;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled.a`
  color: #ffffff;
  font-size: 17px;
  font-weight: bold;
  text-decoration: none;
  writing-mode: horizontal-tb;
`;

// const LOGIN_URL = 'http://localhost:8000/auth/login';
// const LOGOUT_URL = 'http://localhost:8000/auth/logout';

const Page = () => {
  const router = useRouter();
  const { state, logout } = useAuth();
  const userName = state.userName;

  const handleLogout = () => {
    const kakao = kakaoInit();
    if (kakao && kakao.Auth.getAccessToken()) {
      kakao.Auth.logout();
    }
    logout();
    router.replace('/');
  };

  // useEffect(() => {
  //   const kakao = kakaoInit();
  //   return () => {
  //     if (kakao && kakao.Auth.getAccessToken()) {
  //       kakao.Auth.logout();
  //     }
  //   };
  // }, []);

  return (
    <div>
      <Navbar>
        <NavContainer>
          <NavLink href="/">アグリート</NavLink>
        </NavContainer>
        <NavLinks>
          <NavItem>
            <NavLink href="#">PageTop</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Controller</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/dashboard">DashBoard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/boards/main">QnA</NavLink>
          </NavItem>
          <NavItem>
            {userName ? (
              <>
                <div className="font-bold text-white">{`Hello, ${userName}`}</div>
                <button className="font-bold text-white" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login">
                <p className="font-bold text-white">Sign In</p>
              </Link>
            )}
          </NavItem>
        </NavLinks>
      </Navbar>
      {/* 나머지 콘텐츠 */}
    </div>
  );
};

export default Page;
