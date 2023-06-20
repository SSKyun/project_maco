import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import authRequest from '@/utils/request/authRequest';
import { UMachine } from '@/pages/dashboard/interfaces/umachine';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import MedicationIcon from '@mui/icons-material/Medication';
// import SpeedIcon from '@mui/icons-material/Speed';

// json 읽을때 사용
// interface MachineData {
//   device: string;
//   umachine_add: string;
//   wval1: number;
//   wval2: number;
//   [key: string]: string | number;
// }

interface MachineData {
  id: number;
  device: string;
  umachine_add: string;
  rwtime1: number;
  rwtime2: number;
  rcval1: number;
  rcval2: number;
  rctime: number;
  [key: string]: string | number;
}

const DashboardDirectControl = () => {
  const [machineData, setMachineData] = useState<MachineData[]>([]);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const manualResponse = await authRequest.get<MachineData[]>(
          'http://localhost:8000/manual'
        );
        const machineResponse = await authRequest.get<UMachine[]>(
          'http://localhost:8000/machine'
        );

        const mergedData = manualResponse.data.map((manual) => {
          const machine = machineResponse.data.find(
            (m) => m.device === manual.device
          );
          return { ...manual, m_address: machine?.m_address || '' };
        });

        setMachineData(mergedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMachineData();
  }, []);

  return (
    <Grid container spacing={2}>
      {machineData.map((machine, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" noWrap>
                <Box component="span" mr={1}>
                  장치 :
                </Box>
                <Box component="span" fontWeight="bold">
                  {machine.m_address} ({machine.device})
                </Box>
              </Typography>
              <Grid container spacing={2}>
                {/* 관수 1 */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      backgroundColor:
                        machine.rwtime1 > 0 ? 'green' : 'grey.300',
                      color: 'white',
                      minHeight: '100%',
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        <OpacityIcon /> 관수 1
                      </Typography>
                      <Typography variant="h6">
                        {Math.max(machine.rwtime1, 0)}분
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {/* 관수 2 */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      backgroundColor:
                        machine.rwtime2 > 0 ? 'green' : 'grey.300',
                      color: 'white',
                      minHeight: '100%',
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        <OpacityIcon /> 관수 2
                      </Typography>
                      <Typography variant="h6">
                        {Math.max(machine.rwtime2, 0)}분
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {/* 액비 1 */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      backgroundColor:
                        machine.rcval1 > 0 && machine.rctime > 0
                          ? 'blue'
                          : 'grey.300',
                      color: 'white',
                      minHeight: '100%',
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        <MedicationIcon /> 액비 1
                      </Typography>
                      <Typography variant="h6">
                        {machine.rcval1 > 0 ? Math.max(machine.rctime, 0) : 0}분
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {/* 액비 2 */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      backgroundColor:
                        machine.rcval2 > 0 && machine.rctime > 0
                          ? 'blue'
                          : 'grey.300',
                      color: 'white',
                      minHeight: '100%',
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        <MedicationIcon /> 액비 2
                      </Typography>
                      <Typography variant="h6">
                        {machine.rcval2 > 0 ? Math.max(machine.rctime, 0) : 0}분
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardDirectControl;
