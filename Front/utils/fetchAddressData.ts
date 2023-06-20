import axios from 'axios';

export interface AddressData {
  address: string;
}

export const fetchAddressData = async (
  latitude: number,
  longitude: number
): Promise<AddressData> => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
  );

  const { display_name } = response.data;
  return {
    address: display_name,
  };
};
