import axios from "axios";

export async function refreshAccessToken() {

  try {
      const res = await axios.post("/jwt/refresh", {}, { withCredentials: true });
      if (!res.data?.accessToken) 
      {
        return Promise.reject({
          response:{
            status : 401, 
            data: {message : "AccessToken 갱신 실패"}
          }
        });
      }
      return res.data.accessToken;
  }
  catch(err)
  {
    return Promise.reject(err); 
  }  
}
