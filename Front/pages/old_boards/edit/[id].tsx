import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import authRequest from '@/utils/request/authRequest';
import { Board } from '@/pages/boards/interface/board';

const EditBoard = () => {
  const router = useRouter();
  const [boardId, setBoardId] = useState<string>('');
  const [board, setBoard] = useState<Board | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [id, setId] = useState<number>(1);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await authRequest.get<Board>(
          `http://localhost:8000/boards/${boardId}`
        );
        setBoard(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        const user = getUser();
      } catch (error) {
        console.error(error);
      }
    };

    if (boardId) {
      fetchBoard();
    }
  }, [boardId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await authRequest.patch(
        `http://localhost:8000/boards/${board?.id}`,
        {
          title,
          description,
        }
      );
      window.alert('수정 완료');
      router.replace('/boards/main');
    } catch (error) {
      console.error(error);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
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

  useEffect(() => {
    if (router.query.id) {
      setBoardId(router.query.id as string);
    }
  }, [router.query.id]);

  const handleGoBack = () => {
    router.back();
  };

  const handleManagerSubmit = async () => {
    try {
      const response = await authRequest.patch(
        `http://localhost:8000/boards/${board?.id}`,
        {
          title,
          description,
          admin_check: true,
        }
      );
      window.alert('관리자 수정 완료');
      router.replace('/boards/main');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {board ? (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <h1 className="mb-8 text-4xl">QnA 수정</h1>
          <div className="rounded-lg border border-gray-200 p-8">
            <div className="mb-4">
              <p className="text-sm text-gray-500">제목</p>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">내용</p>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="h-56 w-full resize-none rounded-lg border border-gray-300 p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGoBack}
                className="mr-4 cursor-pointer rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                뒤로가기
              </button>
              <button
                type="submit"
                className="mr-4 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                수정
              </button>
              {id === 1 ? (
                <button
                  type="button"
                  onClick={handleManagerSubmit}
                  className="cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  관리자 수정
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </form>
      ) : (
        <p>게시글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default EditBoard;
