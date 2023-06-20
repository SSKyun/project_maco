import authRequest from '@/utils/request/authRequest';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const CreateBoard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PUBLIC');
  const router = useRouter();

  function create() {
    console.log(status);
    authRequest
      .post('/boards', {
        title,
        description,
        status,
      })
      .then((res) => {
        console.log(res.data);
        router.replace('/boards/main');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert('로그인을 다시 해주세요.');
        } else {
          console.log(error);
          alert('정확하게 입력해 주세요.');
        }
      });
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl">글쓰기</h1>
      <div className="w-full max-w-2xl rounded-lg border border-gray-200 p-8">
        <div className="mb-4">
          <p className="text-sm text-gray-500">제목</p>
          <input
            className="w-full rounded-lg border border-gray-300 p-2"
            placeholder="제목 입력"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">내용</p>
          <textarea
            className="h-56 w-full resize-none rounded-lg border border-gray-300 p-2"
            placeholder="내용 입력"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label>
            <input
              type="radio"
              value="PUBLIC"
              checked={status === 'PUBLIC'}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            />
            공개
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="PRIVATE"
              checked={status === 'PRIVATE'}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            />
            비공개
          </label>
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
            className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => {
              create();
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
