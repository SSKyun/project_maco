interface DataPoint {
  date: string;
  prediction: number;
}

export const formatChartData = (data: string) => {
  const parsedData = JSON.parse(data);

  // 배열이 아닌 경우에 대한 처리
  if (!Array.isArray(parsedData)) {
    console.error('올바르지 않은 데이터 형식:', parsedData);
    return;
  }

  const labels = parsedData.map((item: DataPoint) => item.date);
  const datasetsData = parsedData.map((item: DataPoint) => item.prediction);

  const chartData = {
    labels,
    datasets: [
      {
        data: datasetsData,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointRadius: 0,
      },
    ],
  };

  return chartData;
};

export const formatDate = (dateStr: any) => {
  if (typeof dateStr === 'string') {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  return dateStr;
};
