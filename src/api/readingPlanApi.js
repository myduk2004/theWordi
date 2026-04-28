import api from "./api"; 
const API_URL = "/reading-plans";

export const readingPlanApi =  {
    create : async (data) => {
        const { planId, ...reqData} = data;
        const res = await api.post(`${API_URL}`, reqData); 
        return res;
    },
    update : async(data) => {
        const { planId, ...reqData} = data;
        const res = await api.put(`${API_URL}/${planId}`, reqData);
        return res; 
    }, 
    delete : async(id) => { 
        await api.delete(`${API_URL}/${id}`);
    }, 
    getAll : async () => {
        const res = await api.get(`${API_URL}`);
        return res.data;
    },
};
 
 
 