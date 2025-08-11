import { useQuery } from '@tanstack/react-query';

import { getUserAddresses } from '@/actions/get-user-addresses';
import { shippingAddressTable } from '@/db/schema';

export const getUserAddressesKey = () => ['user-addresses'] as const;

export const useUserAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUserAddressesKey(),
    queryFn: getUserAddresses,
    staleTime: 1000 * 60 * 5,
    initialData: params?.initialData,
  });
};
