import authRequest from '@/utils/request/authRequest';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Board } from '../interface/board';

const ShowBoard = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const router = useRouter();

  const showBoard = async (boardId: number) => {
    try {
      const response = await authRequest.get<Board>(
        `http://localhost:8000/boards/${boardId}`
      );
      setBoard(response.data);
    } catch (error) {
      console.error(error);
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
              <p className="text-lg text-black">{board.description}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                href={`/boards/edit/${board.id}`}
              >
                수정
              </Link>
              <button
                onClick={deleteBoard}
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
