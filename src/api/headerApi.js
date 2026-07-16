import api from "./api";

export const HeaderApi = {
  getHeaderTitle: async () => {
    const res = await api.get(`/header/titles`);
    return res.data;
  },
};
