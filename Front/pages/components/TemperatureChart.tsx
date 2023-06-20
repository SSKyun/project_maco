import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import authRequest from '@/utils/request/authRequest';
import { Chart, Plugin } from 'chart.js';

interface TemperatureChartData {
  id: number;
  temperature: number;
  humidity: number;
  soil_humid: number;
  grow: number;
  created_at: string;
}

const TemperatureChart: React.FC = () => {
  const [data, setData] = useState<TemperatureChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authRequest.get<TemperatureChartData[]>(
          `http://localhost:8000/envir`
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const createChartData = (
    data: TemperatureChartData[],
    dataKey: keyof TemperatureChartData,
    borderColor: string
  ) => {
    const labels = data.map((item) => {
      const date = new Date(item.created_at);
      return `${
        date.getMonth() + 1
      }월 ${date.getDate()}일 ${date.getHours()}시`;
    });
    const chartData = data.map((item) => item[dataKey]);

    return {
      labels,
      datasets: [
        {
          label: '온도 (°C)',
          data: chartData,
          backgroundColor: 'transparent',
          borderColor,
          borderWidth: 1,
          fill: false,
          pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        },
      ],
    };
  };

  const chartData = createChartData(
    data,
    'temperature',
    'rgba(255, 159, 64, 1)'
  );

  const amColor = 'rgba(173, 216, 230, 0.2)'; // 파스텔 톤의 낮색
  const pmColor = 'rgba(230, 173, 230, 0.2)'; // 파스텔 톤의 밤색

  const dayNightBackgroundPlugin: Plugin<'line', Record<string, unknown>> = {
    id: 'dayNightBackground',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const canvas = chart.canvas;
      const chartArea = chart.chartArea;

      data.forEach((item, index) => {
        const date = new Date(item.created_at);
        const prevDate =
          index > 0 ? new Date(data[index - 1].created_at) : null;
        const left =
          chartArea.left +
          (prevDate ? chart.scales.x.getPixelForValue(prevDate.getTime()) : 0);
        const right = chart.scales.x.getPixelForValue(date.getTime());
        const width = right - left;

        const isDay = date.getHours() >= 0 && date.getHours() < 12;
        ctx.fillStyle = isDay ? amColor : pmColor;
        ctx.fillRect(
          left,
          chartArea.top,
          width,
          chartArea.bottom - chartArea.top
        );
      });
    },
  };

  return (
    <div>
      <h2 className="clip-right mb-4 mt-8 ml-4 w-1/5 rounded-l border border-blue-300 bg-lime-200 p-2 text-2xl font-bold">
        온도 그래프
      </h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              labels: {
                color: 'rgba(0, 0, 0, 0.8)',
              },
            },
          },
        }}
        plugins={[dayNightBackgroundPlugin]}
      />
    </div>
  );
};

const getBackgroundColor = (
  dateString: string,
  amColor: string,
  pmColor: string
) => {
  const date = new Date(dateString);
  const hour = date.getHours();
  return hour >= 0 && hour < 12 ? amColor : pmColor;
};

export default TemperatureChart;
