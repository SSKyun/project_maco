import React, { useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/router';
import authRequest from '@/utils/request/authRequest';
import { MachineData } from '@/pages/dashboard/interfaces/machineData';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import Divider from '@mui/material/Divider';
import { useQuery } from 'react-query';

const CustomContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 128px)',
  backgroundColor: '#f7fafc',
  padding: theme.spacing(4),
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 8,
  padding: theme.spacing(4),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
}));

const ManualControlWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  flexGrow: 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(4),
  },
}));

const VideoWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100vw',
  height: '40vh', // 높이를 40vh로 설정하여 화면의 절반보다 작게 차지하도록 변경
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    marginTop: 0,
  },
}));

const Video = styled('iframe')({
  border: 'none',
  width: '100%',
  height: '100%',
});

const DividerWrapper = styled('div')({
  width: '100%',
  margin: '16px 0',
});

type ActionType =
  | { type: 'UPDATE_MACHINE_DATA'; key: keyof MachineData; value: any }
  | { type: 'INIT_MACHINE_DATA'; data: MachineData }
  | { type: 'RESET_MACHINE_DATA' };

const reducer = (state: any, action: ActionType) => {
  switch (action.type) {
    case 'UPDATE_MACHINE_DATA':
      return {
        ...state,
        [action.key]: action.value,
      };
    case 'INIT_MACHINE_DATA':
      return {
        ...action.data,
      };
    case 'RESET_MACHINE_DATA':
      return {
        ...state,
        rwtime1: 0,
        rwtime2: 0,
        rcval1: 0,
        rcval2: 0,
        rctime: 0,
      };
    default:
      return state;
  }
};

const ManualControl = () => {
  const router = useRouter();
  const { device } = router.query;
  const [isOperating, setIsOperating] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isMeasuringLength, setIsMeasuringLength] = useState(true);

  const fetchMachineData = async () => {
    try {
      const response = await authRequest.get<MachineData[]>(
        `http://localhost:8000/manual`
      );
      const deviceData = response.data.find((data) => data.device === device);
      if (deviceData) {
        return deviceData;
      } else {
        console.error('기기를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: machineData,
    refetch: refetchMachineData,
    isLoading,
  } = useQuery(['machineData', device], fetchMachineData, {
    enabled: !!device, // device 값이 있을 경우에만 쿼리 실행
    refetchInterval: 10000, // 10초마다 데이터 갱신
    refetchOnWindowFocus: false, // 창 포커스 변경시 새로고침 방지
  });

  const [state, dispatch] = useReducer(reducer, {});

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // setIsMeasuringLength(false);
  };

  const toggleVideo = () => {
    setIsMeasuringLength(!isMeasuringLength);
    setIsVideoLoading(true);
  };

  useEffect(() => {
    if (machineData) {
      dispatch({
        type: 'INIT_MACHINE_DATA',
        data: machineData,
      });
      // isOperating 상태 업데이트
      if (
        machineData.rwtime1 > 0 ||
        machineData.rwtime2 > 0 ||
        machineData.rctime > 0
      ) {
        setIsOperating(true);
      } else {
        setIsOperating(false);
      }
    }
  }, [machineData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof MachineData
  ) => {
    if (machineData && !isOperating) {
      const target = event.target as HTMLInputElement;
      dispatch({
        type: 'UPDATE_MACHINE_DATA',
        key,
        value: key.startsWith('rcval')
          ? target.checked
            ? 1
            : 0
          : parseInt(target.value),
      });
    }
  };

  const handleToggleButton = async () => {
    if (machineData) {
      try {
        const data = isOperating
          ? {
              device: machineData.device,
              rwtime1: 0,
              rwtime2: 0,
              rcval1: 0,
              rcval2: 0,
              rctime: 0,
            }
          : {
              device: machineData.device,
              rwtime1: state.rwtime1,
              rwtime2: state.rwtime2,
              rcval1: state.rcval1,
              rcval2: state.rcval2,
              rctime: state.rctime,
            };
        await authRequest.patch(
          `http://localhost:8000/manual/${machineData.id}`,
          data
        );
        console.log(`machineId : ${machineData.id} `);
        setIsOperating((prevIsOperating) => !prevIsOperating);
        console.log(
          isOperating
            ? '기기 가동이 정지되었습니다.'
            : '기기 조작이 성공적으로 완료되었습니다.',
          data
        );
        alert(
          isOperating
            ? '기기 가동이 정지되었습니다.'
            : '기기 조작이 성공적으로 완료되었습니다.'
        );
        handleOpenModal();
      } catch (error) {
        console.error('기기 조작에 실패했습니다.', error);
        alert('기기 조작에 실패했습니다.');
      }
    }
  };

  if (isLoading || !machineData) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <CustomContainer>
      <Typography variant="h4" gutterBottom align="center">
        {`${machineData.device}기기 수동 조작`}
      </Typography>
      <ContentWrapper>
        <ManualControlWrapper>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="관수 1 : 시간(분)"
              type="number"
              // value={state.rwtime1 || ''}
              value={state.rwtime1}
              onChange={(event) => handleInputChange(event, 'rwtime1')}
              InputProps={{
                inputProps: {
                  min: 0,
                },
                disabled: isOperating,
              }}
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="관수 2 : 시간(분)"
              type="number"
              value={state.rwtime2}
              onChange={(event) => handleInputChange(event, 'rwtime2')}
              InputProps={{
                inputProps: {
                  min: 0,
                },
                disabled: isOperating,
              }}
            />
          </Box>
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.rcval1 === 1}
                  onChange={(event) => handleInputChange(event, 'rcval1')}
                  disabled={isOperating}
                />
              }
              label="액비 1"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.rcval2 === 1}
                  onChange={(event) => handleInputChange(event, 'rcval2')}
                  disabled={isOperating}
                />
              }
              label="액비 2"
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="액비 작동 시간"
              type="number"
              value={state.rctime}
              onChange={(event) => handleInputChange(event, 'rctime')}
              InputProps={{
                inputProps: {
                  min: 0,
                },
                disabled: isOperating,
              }}
            />
          </Box>
          <DividerWrapper>
            <Divider />
          </DividerWrapper>
          <button
            onClick={handleToggleButton}
            className={`absolute bottom-0 w-full ${
              isOperating ? 'bg-red-600' : 'bg-green-600'
            } py-2 font-bold text-white`}
          >
            {isOperating ? '가동 정지' : '가동 시작'}
          </button>
        </ManualControlWrapper>
      </ContentWrapper>
      {openModal && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-2xl font-bold">
              {isMeasuringLength
                ? '길이 측정'
                : `실시간 영상 : ${machineData.device}`}
            </h2>
            <div className="mb-4">
              {isVideoLoading && (
                <p className="mb-2 text-center">로딩 중입니다...</p>
              )}
              <img
                src={
                  isMeasuringLength
                    ? 'http://172.21.4.76:8001/size_feed'
                    : 'http://172.21.4.76:8001/video_feed'
                }
                alt={isMeasuringLength ? '길이 측정' : '실시간 영상'}
                onLoad={() => setIsVideoLoading(false)}
              />
            </div>
            <button
              className="mr-2 bg-red-600 px-4 py-2 text-white"
              onClick={() => setOpenModal(false)}
            >
              닫기
            </button>
            <button
              className={
                isMeasuringLength
                  ? 'bg-orange-600 px-4 py-2 text-white'
                  : 'bg-pink-600 px-4 py-2 text-white'
              }
              onClick={toggleVideo}
            >
              {isMeasuringLength ? '실시간 영상 보기' : '길이 측정'}
            </button>
          </div>
        </div>
      )}
    </CustomContainer>
  );
};

export default ManualControl;
