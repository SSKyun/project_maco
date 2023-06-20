// /components/RecommendedValues.tsx
import { useEffect, useState } from 'react';
import { useSocketData } from '@/utils/socket';
import authRequest from '@/utils/request/authRequest';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import WaterOutlinedIcon from '@mui/icons-material/WaterOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Card, CardContent, CardHeader } from '@mui/material';

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

const RecommendedValues = () => {
  const URL = 'ws://172.21.1.17:8002/grow';
  const dataKeys = ['image', 'recommended', 'prediction'];
  const { data, loading } = useSocketData<Data>(URL, dataKeys);
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

  if (loading || !latestEnvironment) {
    return <div>데이터를 불러오는 중...</div>;
  }

  const tempDifference =
    data.recommended.temperature - latestEnvironment.temperature;
  const humidityDifference =
    data.recommended.humidity - latestEnvironment.humidity;

  return (
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
  );
};

export default RecommendedValues;
