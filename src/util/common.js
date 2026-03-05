 
//오늘 날짜 가져오기
export const todayYMD = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const local = new Date(now - offset);
  return local.toISOString().slice(0, 10);
};