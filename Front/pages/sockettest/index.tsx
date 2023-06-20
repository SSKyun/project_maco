import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSocketData } from '@/utils/socket';
import authRequest from '@/utils/request/authRequest';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import WaterOutlinedIcon from '@mui/icons-material/WaterOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Card, CardContent, CardHeader } from '@mui/material';
import Image from 'next/image';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface Data {
  image: string;
  recommended: {
    temperature: number;
    humidity: number;
  };
  prediction: string;
}

interface EnvironmentData {
  id: number;
  temperature: number;
  humidity: number;
  soil_humid: number;
  grow: number;
  created_at: string;
}

const SocketTest = () => {
  const URL = 'ws://172.21.1.17:8002/grow';
  const dataKeys = ['image', 'recommended', 'prediction'];
  const { data, loading } = useSocketData<Data>(URL, dataKeys);
  const [chartData, setChartData] = useState<any>();
  const [envData, setEnvData] = useState<EnvironmentData[]>([]);
  const [latestEnvironment, setLatestEnvironment] = useState<EnvironmentData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authRequest.get<EnvironmentData[]>(
          `http://localhost:8000/envir`
        );
        setEnvData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (envData.length > 0) {
      setLatestEnvironment(envData[envData.length - 1]);
    }
  }, [envData]);

  useEffect(() => {
    if (!loading && data && data.prediction) {
      const parsedPrediction = JSON.parse(data.prediction);
      const dateData = parsedPrediction.date.map(
        (dateStr: string) =>
          new Date(
            parseInt(dateStr.slice(0, 4)),
            parseInt(dateStr.slice(4, 6)) - 1,
            parseInt(dateStr.slice(6, 8))
          )
      );
      const lengthData = parsedPrediction.length.map((value: any) =>
        parseFloat((value as number).toFixed(4))
      );

      setChartData({
        labels: dateData,
        datasets: [
          {
            label: '성장률 예측',
            data: lengthData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointRadius: 5,
          },
        ],
      });
    }
  }, [data, loading]);

  if (loading || !latestEnvironment) {
    return <div>데이터를 불러오는 중...</div>;
  }

  const tempDifference =
    data.recommended.temperature - latestEnvironment.temperature;
  const humidityDifference =
    data.recommended.humidity - latestEnvironment.humidity;

  return (
    <div>
      <Image src={`data:image/png;base64,${data.image}`} alt="그래프 이미지" />
      <h2>추천 온도: {data.recommended.temperature.toFixed(2)}°C</h2>
      <h2>추천 습도: {data.recommended.humidity.toFixed(2)}%</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="rounded-md">
          <CardHeader
            className="bg-red-500 text-white"
            title="추천 온도"
            avatar={<ThermostatOutlinedIcon />}
          />
          <CardContent>
            <h2 className="text-center text-3xl">
              {data.recommended.temperature.toFixed(1)}°C
            </h2>
            <p className="text-center">
              추천 온도 :{' '}
              <span
                className={`${
                  tempDifference > 0 ? 'text-red-600' : 'text-blue-600'
                } font-bold`}
              >
                {tempDifference.toFixed(1)}°C{'만큼 '}
                {tempDifference > 0 ? (
                  <ArrowUpwardIcon style={{ color: 'red' }} />
                ) : (
                  <ArrowDownwardIcon style={{ color: 'blue' }} />
                )}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-md">
          <CardHeader
            className="bg-blue-600 text-white"
            title="추천 습도"
            avatar={<WaterOutlinedIcon />}
          />
          <CardContent>
            <h2 className="text-center text-3xl">
              {data.recommended.humidity.toFixed(1)}%
            </h2>
            <p className="text-center">
              추천 습도 :{' '}
              <span
                className={`${
                  humidityDifference > 0 ? 'text-red-600' : 'text-blue-600'
                } font-bold`}
              >
                {humidityDifference.toFixed(1)}%{'만큼 '}
                {humidityDifference > 0 ? (
                  <ArrowUpwardIcon style={{ color: 'red' }} />
                ) : (
                  <ArrowDownwardIcon style={{ color: 'blue' }} />
                )}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
      <h2>7일 성장률 예측</h2>
      {chartData && (
        <Line
          data={chartData}
          options={{
            scales: {
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
              x: {
                type: 'time',
                adapters: {
                  date: {
                    zone: 'utc',
                  },
                },
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'MMM d',
                  },
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default SocketTest;
