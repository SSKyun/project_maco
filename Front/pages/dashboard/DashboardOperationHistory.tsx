import { LogData } from '@/pages/old_boards/interface/logData';
// import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { UMachine } from '@/pages/old_boards/interface/umachine';
import authRequest from '@/utils/request/authRequest';
import { useQuery } from 'react-query';
import {
  startOfWeek,
  endOfWeek,
  format,
  eachDayOfInterval,
  isThisWeek,
} from 'date-fns';
import { ko } from 'date-fns/locale';

type OperationTimesByDay = {
  [day: string]: {
    wtime1: number;
    wtime2: number;
    ctime: number;
  };
};

const fetchLogs = async () => {
  const machineResponse = await authRequest.get<UMachine[]>(
    'http://localhost:8000/machine'
  );
  const logPromises = machineResponse.data.map(async (machine) => {
    const logResponse = await authRequest.get<string>(
      `http://localhost:8000/manual/log/${machine.device}`
    );
    const logEntries = logResponse.data
      .split('\n')
      .filter((entry) => entry.length > 0);
    const parsedLogEntries = logEntries.map((entry) => {
      const [timestamp, json] = entry.split(' - ');
      return {
        ...JSON.parse(json),
        timestamp,
      };
    });
    return parsedLogEntries;
  });

  const allLogs = await Promise.all(logPromises);
  const logs = allLogs.find((logs) => logs.length > 0) || [];

  // 가동 시간을 계산하고, 일별로 분류합니다.
  const operationTimesByDay = logs.reduce<OperationTimesByDay>((acc, log) => {
    const day = new Date(log.timestamp).toISOString().split('T')[0];
    if (!(day in acc)) {
      acc[day] = {
        wtime1: 0,
        wtime2: 0,
        ctime: 0,
      };
    }
    acc[day].wtime1 += Number(log.wtime1);
    acc[day].wtime2 += Number(log.wtime2);
    acc[day].ctime += Number(log.ctime);
    return acc;
  }, {});

  return operationTimesByDay;
};

const getWeekRange = (date: Date) => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);

  return { start, end };
};

const DashboardOperationHistory = () => {
  const [week, setWeek] = useState(new Date());
  const {
    data: operationTimesByDay,
    isLoading,
    isError,
  } = useQuery<OperationTimesByDay>('operationLog', fetchLogs);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError || !operationTimesByDay) {
    return <div>작동 이력이 없습니다.</div>;
  }

  const { start: startDay, end: endDay } = getWeekRange(week);

  const isThisWeekSelected = isThisWeek(week);

  const eachDayOfTheWeek = eachDayOfInterval({ start: startDay, end: endDay });

  const labels = eachDayOfTheWeek.map((day) =>
    format(day, 'MM-dd, eee', { locale: ko })
  );

  const operationTypes: ('wtime1' | 'wtime2' | 'ctime')[] = [
    'wtime1',
    'wtime2',
    'ctime',
  ];

  const datasets = ['관수1', '관수2', '액비'].map((type, i) => {
    const data = eachDayOfTheWeek.map((day) => {
      const dayString = format(day, 'yyyy-MM-dd');
      return operationTimesByDay[dayString]
        ? operationTimesByDay[dayString][operationTypes[i]]
        : 0;
    });

    return {
      label: type,
      data: data,
      fill: false,
      backgroundColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`,
      borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.2)`,
    };
  });

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const weekString = `${format(startDay, 'MM월')} ${
    Math.floor((startDay.getDate() - 1) / 7) + 1
  }주차`; // 주 정보를 문자열로 변환합니다.

  return (
    <div className="container mx-auto px-4">
      {/* <h1 className="mb-4 text-xl font-bold">일별 가동 시간</h1> */}
      <div className="flex justify-between">
        <button
          className="rounded bg-pink-500 py-2 px-4 font-bold text-white hover:bg-pink-700"
          onClick={() =>
            setWeek(new Date(week.getTime() - 7 * 24 * 60 * 60 * 1000))
          }
        >
          이전 주
        </button>
        <button
          className={`rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 ${
            isThisWeekSelected ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() =>
            !isThisWeekSelected &&
            setWeek(new Date(week.getTime() + 7 * 24 * 60 * 60 * 1000))
          }
        >
          다음 주
        </button>
      </div>
      <Bar
        data={data}
        options={{
          plugins: {
            title: {
              display: true,
              text: weekString, // 그래프 제목을 설정합니다.
            },
          },
        }}
      />{' '}
    </div>
  );
};

export default DashboardOperationHistory;
