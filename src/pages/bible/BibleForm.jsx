import { useState, useEffect, useReducer, useRef } from "react";
import { BibleApi } from "../../api/bibleApi";
import BibleList from "../../components/BibleList";
import BibleSchSelect from "../../components/BibleSchSelect"; 
const BibleForm = () => { 

  const [form, setForm] = useState({
    versionId: "",
    testament: "",
    bookId: 1,
    chapter: 1,
    verse: 1,
    text: "",
  });
  const [errors, setErrors] = useState([]);
  const [list, setList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);

useEffect(() => {
  textRef.current?.focus();
}, [form.verse]);

  //성경구절 리스트 조회
  const loadData = async () => { 
    try
    {
      const data = await BibleApi.getVerses(
        form.versionId,
        form.bookId,
        form.chapter 
      );
 
      //setList(data && data.length > 0? data[0].verses : []);
      setList(data?.[0]?.verses??[]);
     
    }
    catch(e){
      alert("목록 조회 중 오류가 발생했습니다.");
    }
  }; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, 
      [name]: name === "chapter" || name === "verse"?Number(value): value
     });
  };

  const validate = () => {
    const tmpErr = [];

    if (!form.chapter || form.chapter < 1)
      tmpErr.push("장을 정확히 입력해주세요.");

    if (!form.verse || form.verse < 1)
      tmpErr.push("절을 정확히 입력해주세요.");

    if (!form.text)
      tmpErr.push("구절을 입력해주세요.");

    setErrors(tmpErr);
    return tmpErr.length === 0;
  };


  const onDelete = async (verseId) => { 
    try 
    { 
      if (!confirm("삭제하시겠습니까?")) return; 

      const data = await BibleApi.delete(verseId);
      alert("삭제되었습니다!"); 
      await loadData();
      
    } catch (err) 
    {
      const errorMessage = err.data?.message || "오류가 발생했습니다."; 
      // const errorMessage =
      //   err?.response?.data?.message ||
      //   err?.data?.message ||
      //   err?.message ||
      //   "오류가 발생했습니다1.";
      alert(errorMessage); 
    }
  };


  const onCreate = async () => {  
    const {testament, ...dataToSend} = form; 
    try { 
      setLoading(true);
      const data = await BibleApi.create(dataToSend);
      alert("저장되었습니다!"); 
      setLoading(false);

      await loadData();

      //입력폼 초기화(함수형 업데이트 적용)
      setForm(prev => ({
        ...prev,
        verse: Number(prev.verse) + 1, 
        text: ""
      })); 

    } catch (err) {
      const errorMessage = err.response?.data?.message || "오류가 발생했습니다.";
      alert(errorMessage); 
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) {
    return;
  } 
  onCreate();
};
const onClickSearchButton = async (e) => {
  e.preventDefault();  
  
  setForm({ 
    ...form, 
    verse: "" 
  }); 

  if (!form.chapter || form.chapter < 1)
  {
    alert("조회할 장을 입력해주세요.");
    return; 
  }    

  await loadData();
};
 
  return (
    <>
      <div className="container px-4 mt-5 mb-5">
        <div className="row gx-4 justify-content-center">
          <div className="col-lg-9 mb-2">
            <h4>* 성경등록</h4>
          </div>

          <div className="col-lg-9">
            <div className="card mb-4">
              <div className="card-header">킹제임스 표준역 {">"} 창세기</div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit}>
                  <BibleSchSelect
                    form={form}
                    setForm={setForm}
                  ></BibleSchSelect>
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

                  <div className="col-md-12">
                    <textarea
                      className="form-control"
                      name="text"
                      ref={textRef}
                      rows="3"
                      onChange={handleChange}
                      value={form.text}
                      onKeyDown={(e)=>{
                        if (e.key === "Enter" && !e.shiftKey)
                        {
                          
                          handleSubmit(e);
                        }
                      }}
                    ></textarea>
                  </div>

                  <div className="col-md-12 d-flex justify-content-end align-items-center">
                    {errors.map((e, index) => (
                      <span key={index} className="text-danger me-3">
                        * {e}
                      </span>
                    ))}

                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={onClickSearchButton}
                    >
                      조회
                    </button>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                      저장
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <BibleList verses={list} onDelete={onDelete}></BibleList>
          </div>
        </div>
      </div>
    </>
  );
};

export default BibleForm;
