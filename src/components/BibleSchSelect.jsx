import { useEffect, useState } from "react"; 
import { BibleApi } from "../api/bibleApi";
  
const TESTAMENTS  = [
  { testamentId: "OLDT", testamentNm: "구약" },
  { testamentId: "NEWT", testamentNm: "신약" },
];
 

const BibleSchSelect = ({ form, setForm }) => {
  const [version, setVersion] = useState([]);
  const [allBook, setAllBook] = useState([]);
  const [book, setBook] = useState([]);

  useEffect(() => {
    const init = async () => {
       
      const data = await BibleApi.getVersion(); 
      setVersion(data.versions); 
      setAllBook(data.books);

      const defaultVersionId = data.versions[0]?.versionId ??"";
      const defaultTestamentId = TESTAMENTS[0].testamentId;


      const filteredBook = data.books.filter(
        (b) =>
          b.versionId === defaultVersionId && b.testament === defaultTestamentId
      );
      setBook(filteredBook);

      //기본 선택값 셋팅
      setForm((prev) => ({
        ...prev,
        versionId: defaultVersionId,
        testament: defaultTestamentId, //<--
        bookId: filteredBook[0]?.bookId??"",
      }));
    };

    init();
  }, [setForm]);



  const handleChange = (e) => {
    const { name, value } = e.target; 
    
    // 버전변경
    if (name === "versionId") {
      const defaultTestamentId = TESTAMENTS[0].testamentId;

      const filteredBook = allBook.filter(
        (b) => b.versionId === value && b.testament === defaultTestamentId
      );

      // selectbox용 UI 상태 업데이트
      setBook(filteredBook);
     
      setForm((prev) => ({
        ...prev,
        versionId: value,
        testament: defaultTestamentId, //<--
        bookId: filteredBook[0]?.bookId ?? "",
      })); 
    } 
    
    //신구약 변경
    if (name === "testament") {
      const filteredBook = allBook.filter(
        (b) => b.versionId === form.versionId && b.testament === value
      );

      setBook(filteredBook);

      setForm((prev) => ({
        ...prev,
        testament: value, //<--
        bookId: filteredBook[0]?.bookId ?? "",
      }));
    }

    //책변경
    if (name === "bookId") {
      setForm((prev) => ({ ...prev, bookId: value }));
    }
  };

  return (
    <>
      <div className="col-md-3">
        <label htmlFor="versionId" className="form-label">
          버전
        </label>
        <select
          name="versionId"
          value={form.versionId || ""}
          className="form-select"
          onChange={handleChange}
        >
          {version.map((d) => (
            <option key={d.versionId} value={d.versionId}>
              {d.versionName}
            </option>
          ))}
        </select>
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
    </>
  );
};

export default BibleSchSelect;
