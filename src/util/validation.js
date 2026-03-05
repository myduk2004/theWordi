
export const validateNumber = ({val, label, required = false, min = 1}) =>{  
    if (val === "")
    {
        return required? [`${label}을(를) 입력해주세요.`]:[];
    }

    const num = Number(val);    
    return (Number.isNaN(num) || num < min)
        ?[`${label}을(를) ${min} 이상의 숫자로 정확히 입력해주세요.`]
        : []; 
};



export const validate_bible_search = (searchForm) => {
    const tmpErr = [];
    if (!searchForm.versionId || searchForm.versionId.length < 1)
        tmpErr.push("성경버전을 체크해주세요.");  

    tmpErr.push(...validateNumber({val : searchForm.chapter, label : "장", required :  true, min : 1}));
    tmpErr.push(...validateNumber({val : searchForm.verse, label : "절(시작)", required : false, min : 1}));
    tmpErr.push(...validateNumber({val : searchForm.verseTo, label : "절(종료)", required : false, min : 1}));


    if (searchForm.verse !== "" &&  searchForm.verseTo !== "")
    {
        const verseNum = Number(searchForm.verse);
        const verseToNum = Number(searchForm.verseTo);

        if (!Number.isNaN(verseNum) && !Number.isNaN(verseToNum) && verseNum > verseToNum)
        {
            tmpErr.push("시작절은 종료절보다 클 수 없습니다.");
        }
    }

    // setErrors(tmpErr);
    return tmpErr;
}; 