import { useQuery } from '@tanstack/react-query';

import { getUserAddresses } from '@/actions/get-user-addresses';

export const getUserAddressesKey = () => ['user-addresses'] as const;

export const useUserAddresses = () => {
  return useQuery({
    queryKey: getUserAddressesKey(),
    queryFn: getUserAddresses,
    staleTime: 1000 * 60 * 5,
  });
};
