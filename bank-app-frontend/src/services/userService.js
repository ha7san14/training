import axiosInstance from '../api/axiosConfig';

export const createUser = async (user) => {
  const response = await axiosInstance.post('/users/create-user', user);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axiosInstance.get('/users/get-all-users');
  return response.data;
};
