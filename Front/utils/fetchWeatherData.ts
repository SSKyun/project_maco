import axios from 'axios';

export interface WeatherData {
  temperature: number;
  weather: string;
}

export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<WeatherData> => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`
  );

  return {
    temperature: response.data.main.temp,
    weather: response.data.weather[0].description,
  };
};
