import Head from 'next/head';
import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';
import NavBar from './components/navbar';
import NavBar2 from './components/navbar2';
import Footer from './components/footer';
import { Suspense } from 'react';
import MiddleSection from './middleSection';
import { useRouter } from 'next/router';

import { QueryClient, QueryClientProvider } from 'react-query';

import '@/styles/custom.css';
import 'react-datepicker/dist/react-datepicker.css';
// import { ParallaxProvider } from 'react-scroll-parallax';
// import { getUserLocation } from '../utils/getUserLocation';
// import { fetchWeatherData } from '../utils/fetchWeatherData';
// import { fetchAddressData, AddressData } from '../utils/fetchAddressData';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // const [weatherData, setWeatherData] = useState(null);
  // const [addressData, setAddressData] = useState<AddressData | null>(null);
  const queryClient = new QueryClient();
  const router = useRouter();
  // const hideNavbar = router.pathname.startsWith('/boards');

  const hiddenRoutes = ['/boards', '/dashboard', '/sockettest', '/statistic'];
  const hideNavbar = hiddenRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const coords = await getUserLocation();
  //       const apiKey = 'c25164659b769eea85643762776e1d14';
  //       const weather = await fetchWeatherData(
  //         coords.latitude,
  //         coords.longitude,
  //         apiKey
  //       );
  //       const address = await fetchAddressData(
  //         coords.latitude,
  //         coords.longitude
  //       );
  //       console.log(weather);
  //       setWeatherData(weather);
  //       setAddressData(address);
  //     } catch (error) {
  //       console.error('Error fetching weather data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {/* <ParallaxProvider> */}
        <Head>
          <script
            src="https://developers.kakao.com/sdk/js/kakao.js"
            async
          ></script>
        </Head>
        <Suspense fallback={<div>Loading...</div>}></Suspense>
        <AuthProvider>
          {/* <NavBar weather={weatherData} address={addressData?.address} /> */}
          {hideNavbar ? <NavBar2 /> : <NavBar />}
          {/* {hideNavbar ? <></> : <NavBar />} */}
          <Component {...pageProps} />
          {/* <Footer /> */}
          {/* </ParallaxProvider> */}
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
