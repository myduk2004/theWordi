 
//오늘 날짜 가져오기
export const todayYMD = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const local = new Date(now - offset);
  return local.toISOString().slice(0, 10);
};


//받은날짜를 년월일로 변환
export const formatDateKr = (dt) =>{ 

  if (!dt) return "";  
  return new Date(dt).toLocaleDateString('ko-KR', {
    year : 'numeric', 
    month: 'long', 
    day : 'numeric',
    weekday : 'long', 
  });
} 