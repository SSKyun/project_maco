import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { UMachine } from '@/pages/dashboard/interfaces/umachine';
import authRequest from '@/utils/request/authRequest';
import { MachineData } from '@/pages/dashboard/interfaces/machineData';
import Link from 'next/link';
import { styled } from '@mui/system';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { green, blue, grey } from '@mui/material/colors';

const DeviceItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(4),
  cursor: 'pointer',
}));

const DashboardManualControl = () => {
  const [umachines, setUMachines] = useState<UMachine[]>([]);
  const [manualData, setManualData] = useState<MachineData[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUMachines = async () => {
      try {
        const machineResponse = await authRequest.get<UMachine[]>(
          'http://localhost:8000/machine'
        );
        const manualResponse = await authRequest.get<MachineData[]>(
          'http://localhost:8000/manual'
        );
        setUMachines(machineResponse.data);
        setManualData(manualResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUMachines();
  }, []);

  const getManualData = (device: string) => {
    return manualData.find((data) => data.device === device);
  };

  const handleClick = async (umachine: UMachine) => {
    if (isPosting) {
      // 이미 요청이 진행 중이면 더 이상 진행하지 않습니다.
      return;
    }

    setIsPosting(true);

    try {
      const userMachines = await authRequest.get<MachineData[]>(
        'http://localhost:8000/manual'
      );

      const existingMachine = userMachines.data.find(
        (machine) => machine.device === umachine.device
      );

      if (!existingMachine) {
        await authRequest.post('http://localhost:8000/manual', {
          device: umachine.device,
        });
        console.log('새로운 기기 데이터 생성');
      }

      setTimeout(() => {
        router.push(
          `/dashboard/manualcontrol/${umachine.id}?device=${umachine.device}`
        );
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100%"
      paddingX={2}
    >
      <Box marginTop={4}>
        <Typography variant="h4" gutterBottom>
          기기 목록
        </Typography>
      </Box>
      <Box width="100%" maxWidth={1200} paddingBottom={4}>
        {umachines.length === 0 ? (
          <Typography variant="body1" align="center">
            기기 로딩중입니다...
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {umachines.map((umachine) => {
              const currentManualData = getManualData(umachine.device);
              const isRunning1 = currentManualData?.rwtime1
                ? currentManualData.rwtime1 > 0
                : false;
              const isRunning2 = currentManualData?.rwtime2
                ? currentManualData.rwtime2 > 0
                : false;
              const isRunning3 = currentManualData?.rctime
                ? currentManualData.rctime > 0
                : false;
              const chipColor1 = isRunning1 ? 'primary' : 'default';
              const chipColor2 = isRunning2 ? 'primary' : 'default';
              const chipColor3 = isRunning3 ? 'primary' : 'default';

              return (
                <Grid item key={umachine.id} xs={12}>
                  <DeviceItem
                    onClick={() => handleClick(umachine)}
                    elevation={2}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {`기기번호 : ${umachine.device}`}
                        </Typography>
                        <Typography variant="body1" noWrap>
                          {`위치 : ${umachine.m_address}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Chip
                          label={`관수 1 : ${
                            currentManualData?.rwtime1 || 0
                          }분`}
                          sx={{
                            backgroundColor: chipColor1,
                            borderColor: chipColor1,
                            marginRight: 2,
                          }}
                          variant="outlined"
                        />
                        <Chip
                          label={`관수 2 : ${
                            currentManualData?.rwtime2 || 0
                          }분`}
                          sx={{
                            backgroundColor: chipColor2,
                            borderColor: chipColor2,
                            marginRight: 2,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Chip
                          label={`액비 1 : ${
                            currentManualData?.rctime === 1
                              ? currentManualData?.rcval1
                              : 0
                          }분`}
                          sx={{
                            backgroundColor: chipColor3,
                            borderColor: chipColor3,
                            marginRight: 2,
                          }}
                          variant="outlined"
                        />
                        <Chip
                          label={`액비 2 : ${
                            currentManualData?.rctime === 2
                              ? currentManualData?.rcval2
                              : 0
                          }분`}
                          sx={{
                            backgroundColor: chipColor3,
                            borderColor: chipColor3,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </DeviceItem>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default DashboardManualControl;
