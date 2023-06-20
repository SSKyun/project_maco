import { useEffect, useState } from 'react';
import { useSocketData } from '@/utils/socket';
import Image from 'next/image';

interface Data {
  image: string;
  recommended: {
    temperature: number;
    humidity: number;
  };
  prediction: string;
}

const SocketGrowImage = () => {
  const URL = 'ws://172.21.1.17:8002/grow';
  const dataKeys = ['image', 'recommended', 'prediction'];
  const { data, loading } = useSocketData<Data>(URL, dataKeys);

  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <div>
      <h2 className="clip-right mb-4 mt-8 ml-4 w-1/5 rounded-l border border-orange-300 bg-teal-200 p-2 text-2xl font-bold">
        생장 과정 그래프
      </h2>
      <Image
        src={`data:image/png;base64,${data.image}`}
        alt="생장 과정 예측 이미지"
      />
    </div>
  );
};

export default SocketGrowImage;
