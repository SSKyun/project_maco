import { useSocketData } from '../../utils/socket';
import { Line } from 'react-chartjs-2';
import { formatChartData, formatDate } from './utils';

interface Data {
  image: string;
  prediction: string;
}

const Apple = () => {
  const URL = 'ws://172.21.1.17:8002/apple';
  const dataKeys = ['image', 'prediction'];
  const { data, loading } = useSocketData<Data>(URL, dataKeys);

  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  const chartData = formatChartData(data.prediction);

  if (!chartData) {
    return <div>차트 데이터를 불러올 수 없습니다.</div>;
  }
  return (
    <div>
      <img src={`data:image/png;base64,${data.image}`} alt="그래프 이미지" />
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM D',
                },
                tooltipFormat: 'MMM D, YYYY',
              },
              ticks: {
                callback: (value: any) => formatDate(value),
              },
            },
            y: {
              ticks: {
                callback: (value: string | number) => {
                  if (typeof value === 'number') {
                    return value.toFixed(4);
                  }
                  return value;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Apple;
