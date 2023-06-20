import axios from 'axios';

export interface WeeklyWeatherData {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: [
    {
      description: string;
    }
  ];
}

export const fetchWeeklyWeatherData = async (
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<WeeklyWeatherData[]> => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}&lang=kr`
  );

  return response.data.daily;
};
