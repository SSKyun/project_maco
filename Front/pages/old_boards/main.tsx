import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import authRequest from '@/utils/request/authRequest';
import Link from 'next/link';
import { Board } from '../boards/interface/board';

type Post = {
  board: Board;
};

const Boards = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await authRequest.get<Board[]>(
        'http://localhost:8000/boards'
      );
      const user = await getUser();
      const allBoards = response.data.filter(
        (board) =>
          board.user.id === user.id ||
          board.status === 'PUBLIC' ||
          board.status === 'PRIVATE'
      );
      allBoards.sort((a, b) => (a.createDate < b.createDate ? 1 : -1));
      const posts = allBoards.map((board) => ({ board }));
      setPosts(posts);
    } catch (error) {
      window.alert('다시 로그인 해 주십시오');
      router.replace('/login');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPosts();
    };
    fetchData();
    setLoading(false);
    console.log('fetchData 실행');
    const intervalId = setInterval(() => {
      fetchData();
    }, 120000); // 2분마다 실행 (2분 * 60초 * 1000밀리초 = 120000밀리초)

    return () => {
      clearInterval(intervalId); // 컴포넌트가 unmount 될 때 타이머를 제거
    };
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl">QnA</h1>
      {loading ? (
        <div className="text-2xl">QnA를 불러오고 있습니다...</div>
      ) : (
        <>
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
                      {post.board.user.id === id || id === 1 ? (
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
              {[...Array(Math.ceil(posts.length / postsPerPage))].map(
                (e, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 ${
                      currentPage === i + 1 && 'bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
          <Link
            className="mt-4 cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            href={'/boards/create'}
          >
            글쓰기
          </Link>
        </>
      )}
    </div>
  );
};

export default Boards;
