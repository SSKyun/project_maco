import React, { useState } from 'react';
import TemperatureChart from '@/pages/components/TemperatureChart';
import HumidityChart from '@/pages/components/HumidityChart';
import EnvironmentGrowChart from '@/pages/components/EnvironmentGrowChart';
import SocketGrowChart from '@/pages/components/SocketGrowChart';
import SocketAppleChart from '@/pages/components/SocketAppleChart';
import SocketPearChart from '@/pages/components/SocketPearChart';

const StatisticPage: React.FC = () => {
  const [activeChart, setActiveChart] = useState<
    | 'temperature'
    | 'humidity'
    | 'EnvironmentGrow'
    | 'SocketGrow'
    | 'SocketApple'
    | 'SocketPear'
  >('temperature');

  const handleClick = (
    chart:
      | 'temperature'
      | 'humidity'
      | 'EnvironmentGrow'
      | 'SocketGrow'
      | 'SocketApple'
      | 'SocketPear'
  ) => {
    setActiveChart(chart);
  };

  return (
    <div className="flex">
      <div className="w-3/4">
        {activeChart === 'temperature' && <TemperatureChart />}
        {activeChart === 'humidity' && <HumidityChart />}
        {activeChart === 'EnvironmentGrow' && <EnvironmentGrowChart />}
        {activeChart === 'SocketGrow' && <SocketGrowChart />}
        {activeChart === 'SocketApple' && <SocketAppleChart />}
        {activeChart === 'SocketPear' && <SocketPearChart />}
      </div>
      <div className="flex w-1/4 flex-col items-center bg-slate-50 p-4">
        <h2 className="my-8 rounded border-2 border-gray-300 text-2xl font-bold">
          차트 선택
        </h2>
        <button
          onClick={() => handleClick('temperature')}
          className={`mb-16 w-full rounded py-2 px-4 font-semibold text-white ${
            activeChart === 'temperature'
              ? 'bg-lime-500'
              : 'bg-lime-300 hover:bg-lime-400'
          }`}
        >
          온도 차트
        </button>
        <button
          onClick={() => handleClick('humidity')}
          className={`mb-16 w-full rounded py-2 px-4 font-semibold text-white ${
            activeChart === 'humidity'
              ? 'bg-green-500'
              : 'bg-green-300 hover:bg-green-400'
          }`}
        >
          습도 차트
        </button>
        <button
          onClick={() => handleClick('EnvironmentGrow')}
          className={`mb-16 w-full rounded py-2 px-4 font-semibold text-white ${
            activeChart === 'EnvironmentGrow'
              ? 'bg-emerald-500'
              : 'bg-emerald-300 hover:bg-emerald-400'
          }`}
        >
          생장 차트
        </button>
        <button
          onClick={() => handleClick('SocketGrow')}
          className={`mb-16 w-full rounded py-2 px-4 font-semibold text-white ${
            activeChart === 'SocketGrow'
              ? 'bg-teal-500'
              : 'bg-teal-300 hover:bg-teal-400'
          }`}
        >
          생장 과정 예측 차트
        </button>
        <button
          onClick={() => handleClick('SocketApple')}
          className={`mb-16 w-full rounded py-2 px-4 font-semibold text-white ${
            activeChart === 'SocketApple'
              ? 'bg-cyan-500'
              : 'bg-cyan-300 hover:bg-cyan-400'
          }`}
        >
          사과 가격 예측 차트
        </button>
        <button
          onClick={() => handleClick('SocketPear')}
          className={`mb-16 w-full rounded py-2 px-4 font-semibold text-white ${
            activeChart === 'SocketPear'
              ? 'bg-sky-500'
              : 'bg-sky-300 hover:bg-sky-400'
          }`}
        >
          배 가격 예측 차트
        </button>
      </div>
    </div>
  );
};

export default StatisticPage;
