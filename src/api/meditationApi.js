import api from "./api"; 
const API_URL = "/meditations";
 
export const MeditationApi = {
  getVerses1: async (versionIds, bookId, chapter, verse, verseTo) => { 
    const res = await api.get(`${API_URL}/verses`, {
      params: { versionIds, bookId, chapter, verse, verseTo },
    });
    return res.data;
  }, 
  getOne1: async (id) => {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  }, 
  create: async (data) => { 
    const res = await api.post(`${API_URL}/create`, data);
    return res.data;
  },
  getOne: async (id) => {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  },
  update: async (data) => {
    const res = await api.put(`${API_URL}/update`, data);
    return res.data;
  }, 
  delete: async (id) =>{
    const res = await api.delete(`${API_URL}/delete/${id}`);
    return res;
  }, 
  getList: async (reqParam) =>{ 
    const res = await api.get(`${API_URL}`, 
      { params: reqParam });  
    return res.data;
  }
};
