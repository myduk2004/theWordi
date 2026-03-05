import api from "./api"; 
const API_URL = "/api/meditation";
 
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
};
