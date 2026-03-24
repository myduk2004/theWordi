import api from "./api"; 
const API_URL = "/user";
 
export const joinApi = {
  isExistUser: async (username) => { 
    const res = await api.get(`${API_URL}/exist`, {
      params: { username },
    });
    return res.data;
  },  
  create: async (data) => { 
    const res = await api.post(`${API_URL}/create`, data);
    return res.data;
  },
  getOne: async (id) => {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  } 
};
