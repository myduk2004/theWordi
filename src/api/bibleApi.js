import api from "./api"; 
const API_URL = "/api/bible";

export const BibleApi = {
  getVerses: async (versionIds, bookId, chapter, verse, verseTo) => {
    
    const res = await api.get(`${API_URL}/verses`, {
      params: { versionIds, bookId, chapter, verse, verseTo },
    });
    return res.data;
  }, 
  getOne: async (id) => {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  },
  getVersion: async () => {
    const res = await api.get(`${API_URL}/versions`);
    return res.data;
  },
  create: async (data) => { 
    const res = await api.post(`${API_URL}/verse`, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`${API_URL}/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`${API_URL}/verse/${id}`);
    return res;
  },
};
