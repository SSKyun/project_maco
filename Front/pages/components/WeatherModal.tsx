// import { useState, useEffect } from 'react';

// interface WeatherModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   weeklyWeather: any; // 나중에 적절한 타입으로 대체하세요
// }

// export const WeatherModal: React.FC<WeatherModalProps> = ({
//   isOpen,
//   onClose,
//   weeklyWeather,
// }) => {
//   if (!isOpen) return null;

//   function formatDate(timestamp: number) {
//     const date = new Date(timestamp * 1000);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${year}-${month < 10 ? '0' + month : month}-${
//       day < 10 ? '0' + day : day
//     }`;
//   }

//   return (
//     <div className="fixed inset-0 z-10 overflow-y-auto">
//       <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//         <div
//           className="fixed inset-0 transition-opacity"
//           aria-hidden="true"
//           onClick={onClose}
//         >
//           <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//         </div>

//         <div
//           className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-headline"
//         >
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3
//                   className="text-lg font-medium leading-6 text-gray-900"
//                   id="modal-headline"
//                 >
//                   일주일 동안의 날씨
//                 </h3>
//                 <div className="mt-2">
//                   {weeklyWeather.map((weather, index) => (
//                     <p key={index}>
//                       {formatDate(weather.dt)}: {weather.temp.min.toFixed(1)}°C
//                       ~ {weather.temp.max.toFixed(1)}°C,{' '}
//                       {weather.weather[0].description}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//             <button
//               type="button"
//               className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
//               onClick={onClose}
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
