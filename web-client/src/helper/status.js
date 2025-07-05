export const getStatusMeta = (status) => {
  switch (status) {
    case 'pending':
      return { label: 'pending', color: 'bg-yellow-100 text-yellow-800' };
    case 'confirmed':
      return { label: 'confirmed', color: 'bg-blue-100 text-blue-800' };
    case 'shipping':
      return { label: 'shipping', color: 'bg-purple-100 text-purple-800' };
    case 'delivered':
      return { label: 'delivered', color: 'bg-green-100 text-green-800' };
    case 'cancelled':
      return { label: 'cancelled', color: 'bg-red-100 text-red-800' };
    default:
      return {
        label: status.toLowerCase(),
        color: 'bg-gray-100 text-gray-800',
      };
  }
};
