import { useQuery } from 'react-query';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import authRequest from '@/utils/request/authRequest';
import { Board } from '../old_boards/interface/board';

type Post = {
  board: Board;
};

const getPosts = async (userId: number): Promise<Post[]> => {
  const response = await authRequest.get<Board[]>(
    'http://localhost:8000/boards'
  );
  return response.data
    .filter(
      (board) =>
        board.user.id === userId ||
        board.status === 'PUBLIC' ||
        board.status === 'PRIVATE'
    )
    .map((board) => ({ board }));
};

const Boards = () => {
  const [id, setId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const router = useRouter();
  const { data: user } = useQuery('user', () =>
    authRequest.get('http://localhost:8000/auth')
  );
  const postsQuery = useQuery('posts', () => getPosts(user?.data?.id), {
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5분
  });

  useEffect(() => {
    if (user) {
      setId(user.data.id);
      // 사용자 ID가 설정되면 게시물을 가져옵니다.
      postsQuery.refetch();
    }
  }, [user, postsQuery]);

  // if (postsQuery.isLoading) {
  //   return <div>Loading...</div>;
  // }

  const currentPosts = useMemo(() => {
    if (!postsQuery.data) {
      return [];
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return postsQuery.data.slice(indexOfFirstPost, indexOfLastPost);
  }, [postsQuery.data, currentPage, postsPerPage]);

  if (!currentPosts.length) {
    return <div>Loading...</div>;
  }

  if (postsQuery.error) {
    window.alert('다시 로그인 해 주십시오');
    router.replace('/login');
    return (
      <div>An error has occurred: {(postsQuery.error as Error).message}</div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getUser = async () => {
    try {
      const response = await authRequest.get('http://localhost:8000/auth');
      setId(response.data.id);
      return response.data;
    } catch (error) {
      console.log('getUser 에러');
    }
  };

  return (
    <>
      {postsQuery.isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-gray-500 opacity-75">
          <div className="flex flex-col items-center rounded-lg border bg-white py-2 px-5">
            <h2 className="text-lg font-semibold">Loading...</h2>
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-3 h-5 w-5 animate-spin border-l-2 border-gray-900"
              >
                <circle cx="12" cy="12" r="10" className="opacity-25" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4.914 13.13a8 8 0 0 0 11.314 0l1.414 1.414a10 10 0 1 1-14.142 0l1.414-1.414zm14.142-2.828a8 8 0 0 0-11.314 0L6.342 9.868a10 10 0 1 1 14.142 0l-1.414 1.414z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-3xl">QnA</h1>
        <div className="w-full sm:w-4/5 md:w-3/5 lg:w-1/2">
          <ul id="post-list">
            {currentPosts.map((post) => (
              <li
                key={post.board.id}
                className="post-item mb-4 cursor-pointer rounded-lg bg-white p-4 shadow hover:bg-gray-100 hover:text-black"
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      글 번호 : {post.board.id}
                      {post.board.status === 'PRIVATE' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1 inline h-4 w-4 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 9a3 3 0 11-6 0 3 3 0 016 0zm-5 6a5 5 0 0110 0H5z" />
                        </svg>
                      )}
                    </span>
                    <span className="text-gray-600">
                      작성자 : {post.board.user.nickname}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    {/* 관리자 id 설정 */}
                    {post.board.user.id === id || id === 2 ? (
                      <Link href={`/boards/show/${post.board.id}`}>
                        <p className="post-title font-bold text-blue-600">
                          글 제목 : {post.board.title}
                        </p>
                      </Link>
                    ) : post.board.status === 'PRIVATE' ? (
                      <Link href={`/boards/show/${post.board.id}`}>
                        <p
                          className="post-title font-bold text-red-500"
                          onClick={(e) => {
                            e.preventDefault();
                            window.alert('비공개 게시글입니다.');
                          }}
                        >
                          비공개 게시글입니다.
                        </p>
                      </Link>
                    ) : (
                      <Link href={`/boards/show/${post.board.id}`}>
                        <p className="post-title font-bold text-blue-600">
                          글 제목 : {post.board.title}
                        </p>
                      </Link>
                    )}
                    {post.board.admin_check && (
                      <div className="flex items-center">
                        <span className="font-semibold text-green-600">
                          답변 완료
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1 h-5 w-5 text-green-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* 작성자와 루트 사용자를 제외한 사용자는 볼 수 없게 수정 */}
          {/* 여기에 해당 사용자의 role에 따른 로직을 추가해주세요 */}
          <div className="flex justify-center">
            {[
              ...Array(
                Math.ceil((postsQuery.data?.length || 0) / postsPerPage)
              ),
            ].map((e, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 ${
                  currentPage === i + 1 && 'bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <Link
          className="mt-4 cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          href={'/boards/create'}
        >
          글쓰기
        </Link>
      </div>
    </>
  );
};

export default Boards;
