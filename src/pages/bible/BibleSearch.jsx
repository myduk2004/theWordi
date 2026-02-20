import { useState, useEffect, useReducer, createContext } from "react";
import { BibleApi } from "../../api/bibleApi";
import BibleLists from "../../components/BibleLists"; 

const TESTAMENTS  = [
  { testamentId: "OLDT", testamentNm: "구약" },
  { testamentId: "NEWT", testamentNm: "신약" },
]; 

export const VerseContext = createContext();

const BibleSearch = () => { 

  const [form, setForm] = useState({
    versionIds: [],
    testament: "OLDT",
    bookId: 1,
    chapter: 1,
    verse: "" 
  });
  const [errors, setErrors] = useState([]);
  const [list, setList] = useState([]); 
  const [loading, setLoading] = useState(false);


  const [version, setVersion] = useState([]);
  const [allBook, setAllBook] = useState([]);
  const [book, setBook] = useState([]);


  useEffect(() => {
      const init = async () => {
         
        const data = await BibleApi.getVersion(); 
       
        setVersion(data.versions); 
        const defaultVersionId = data.versions[0]?.versionId ??"";
        const defaultTestamentId = TESTAMENTS[0].testamentId;  

        const defaultAllBooks = data.books.filter((b) => b.versionId === defaultVersionId); 
        setAllBook(defaultAllBooks); 
        const filteredBook = defaultAllBooks.filter((b) =>b.testament === defaultTestamentId);  
        setBook(filteredBook); 
 
        setForm((prev) => ({
          ...prev, 
          testament: defaultTestamentId,  
          bookId: filteredBook[0]?.bookId??"",
        })); 
      };
  
      init();
    }, []);


  //성경구절 리스트 조회
  const loadData = async () => { 
    try
    {
      const data = await BibleApi.getVerses(
        form.versionIds,
        form.bookId,
        form.chapter 
      );

      //console.log(data);
      setList(data); 
    }
    catch(e){
      alert("목록 조회 중 오류가 발생했습니다.");
    }
  }; 

  const handleChange = (e) => {
    const { name, value, checked } = e.target;  

    //version체크시
    if (name === "versionIds")
    {  
      setForm((prev) =>({ 
        ...prev, 
        versionIds : checked?prev.versionIds.includes(value)?prev.versionIds:[...prev.versionIds, value]
                            :prev.versionIds.filter((id)=> id !== value) 
      })); 
    }
    //신구약 변경
    else if (name === "testament") {
      const filteredBook = allBook.filter((b) => b.testament === value);  
      setBook(filteredBook);

      setForm((prev) => ({
        ...prev,
        testament: value,  
        bookId: filteredBook[0]?.bookId ?? "",
      }));
    }
    else 
    { 
      setForm((prev) => ({
        ...prev,
        [name]: name === "chapter" || name === "verse"
          ? Number(value)
          : value
      }));
    }
  };

  const validate = () => {
    const tmpErr = [];
    if (!form.versionIds || form.versionIds.length < 1)
      tmpErr.push("성경버전을 체크해주세요."); 

    if (!form.chapter || form.chapter < 1)
      tmpErr.push("장을 입력해주세요."); 
    
    setErrors(tmpErr);
    return tmpErr.length === 0;
  }; 
  
const onClickSearchButton = async (e) => {
  e.preventDefault();  
  if (!validate()) {
    return;
  } 

  setForm({ 
    ...form, 
    verse: "" 
  });  
  await loadData();
};
 
 
  return (
    <>
      <div className="container px-4 mt-5 mb-5">
        <div className="row gx-4 justify-content-center">
          <div className="col-lg-9 mb-2">
            <h4>* 성경조회</h4>
          </div>

          <div className="col-lg-9">
            <div className="card mb-4">
              <div className="card-header">킹제임스 표준역 {">"} 창세기</div>
              <div className="card-body">
                <form className="row g-3">
                  <div className="col-md-12">
                    <label htmlFor="divBible" className="form-label">
                      성경버전
                    </label>
                    <div className="divBible">  
                      {  
                        version.map((d) => ( 
                          <div className="form-check form-check-inline"
                          key={d.versionId}>
                            <input className="form-check-input" type="checkbox"  
                            onChange={handleChange}
                            id={d.versionId}
                            name="versionIds"  
                            value={d.versionId} />
                            <label className="form-check-label" htmlFor={d.versionId}>{d.versionName}</label>
                          </div>
                        ))
                      } 
                    </div> 
                  </div> 
                  <div className="col-md-2">
                    <label htmlFor="testament" className="form-label">
                      신/구약
                    </label>
                    <select
                      name="testament"
                      value={form.testament || ""}
                      className="form-select"
                      onChange={handleChange}
                    >
                      {TESTAMENTS.map((d) => (
                        <option key={d.testamentId} value={d.testamentId}>
                          {d.testamentNm}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="bookId" className="form-label">
                      책명
                    </label>
                    <select
                      name="bookId"
                      value={form.bookId || ""}
                      className="form-select"
                      onChange={handleChange}
                    >
                      {book.map((d) => (
                        <option key={d.bookId} value={d.bookId}>
                          {d.nameKo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="chapter" className="form-label">
                      장
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="chapter"
                      onChange={handleChange}
                      value={form.chapter}
                    />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="verse" className="form-label">
                      절
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="verse"
                      onChange={handleChange}
                      value={form.verse}
                    />
                  </div>
              
                  <div className="col-md-12 d-flex justify-content-end"> 
                    {errors.map((e, index) => (
                      <p key={e} className="text-danger me-3">
                        * {e}
                      </p>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={onClickSearchButton}
                    >
                      조회
                    </button> 
                  </div>
                </form>
              </div>
            </div>

            <VerseContext.Provider value={list}>
              <BibleLists></BibleLists>
            </VerseContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
};

export default BibleSearch;
