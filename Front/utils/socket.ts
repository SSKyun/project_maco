import { useState, useEffect } from 'react';

// generic을 사용하여 타입을 지정
export const useSocketData = <T extends object>(
  url: string,
  dataKeys: string[]
) => {
  const [data, setData] = useState<T>({} as T);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.addEventListener('open', () => {
      console.log('소켓 연결 성공');
    });

    socket.addEventListener('message', (message) => {
      try {
        const parsedData = JSON.parse(message.data);

        if (message.data.includes('Invalid request')) {
          console.error(
            '서버에서 올바르지 않은 요청으로 인식했습니다:',
            message.data
          );
        }

        const isValidData = dataKeys.every((key) =>
          parsedData.hasOwnProperty(key)
        );

        if (isValidData) {
          setData(parsedData as T);
          setLoading(false);
          console.log(data);
        } else {
          console.error('올바르지 않은 데이터 형식:', message.data);
        }
      } catch (error) {
        console.error('JSON 파싱 오류:', error, message.data);
      }
    });

    socket.addEventListener('close', () => {
      console.log('소켓 연결 종료');
    });

    return () => {
      socket.close();
    };
  }, []);

  return { data, loading };
};
