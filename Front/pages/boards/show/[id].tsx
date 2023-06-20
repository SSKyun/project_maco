import authRequest from '@/utils/request/authRequest';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Board } from '../interface/board';

const ShowBoard = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [id, setId] = useState<number | null>(null);
  const router = useRouter();

  const showBoard = async (boardId: number) => {
    try {
      const response = await authRequest.get<Board>(
        `http://localhost:8000/boards/${boardId}`
      );
      setBoard(response.data);
      getUser();
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await authRequest.get('http://localhost:8000/auth');
      setId(response.data.id);
      return response.data;
    } catch (error) {
      console.log('getUser 에러');
    }
  };

  const handleEditClick = () => {
    if (board?.user.id === id) {
      router.push(`/boards/edit/${board.id}`);
    } else {
      window.alert('권한이 없습니다.');
      router.back();
    }
  };

  const handleDeleteClick = () => {
    if (board?.user.id === id) {
      deleteBoard();
    } else {
      window.alert('권한이 없습니다.');
      router.back();
    }
  };

  useEffect(() => {
    if (router.query.id) {
      const boardId = Number(router.query.id);
      showBoard(boardId);
    } else {
      window.alert('다시 로그인 해 주세요.');
    }
  }, [router.query]);

  const deleteBoard = async () => {
    try {
      await authRequest.delete(`http://localhost:8000/boards/${board?.id}`);
      window.alert('삭제 완료');
      router.replace('/boards/main');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {board ? (
        <>
          <div className="w-full max-w-2xl rounded-lg border border-gray-200 p-8">
            <div className="mb-6">
              <p className="text-sm text-gray-500">제목</p>
              <h1 className="text-3xl text-black">{board.title}</h1>
            </div>
            <div className="mb-8">
              <p className="text-sm text-gray-500">내용</p>
              <textarea
                className="h-56 w-full resize-none rounded-lg border border-gray-300 p-2 text-lg text-black"
                readOnly
                value={board.description}
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleEditClick}
                className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={handleDeleteClick}
                className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                삭제
              </button>
              <Link
                className="cursor-pointer rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                href={'/boards/main'}
              >
                목록으로
              </Link>
            </div>
          </div>
        </>
      ) : (
        <p className="text-lg">게시글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default ShowBoard;
