import api from "./api"; 
const API_URL = "/reading-plans";

export const readingBookApi =  { 
    create : async (planId, data) => { 
        const res = await api.post(`${API_URL}/${planId}/book`, data); 
        return res;
    },  
    getBooks : async (planId, versionId) => {
         
        const res = await api.get(`${API_URL}/${planId}/books`, {params : {versionId},});
        return res.data;
    },
    getBookLogs : async (planId, planBookId) => {
         
        const res = await api.get(`${API_URL}/${planId}/${planBookId}/logs`);
        return res.data;
    },
};
 
 
 