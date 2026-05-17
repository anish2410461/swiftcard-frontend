import api from '../api/axios';

export const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
};

export const updateProfile = async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
};
