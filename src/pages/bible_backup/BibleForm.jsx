import { useState, useEffect } from "react";
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
  const loadData = async () => {
    const data = await BibleApi.getListByChapter(
      form.versionId,
      form.bookId,
      form.chapter 
    );
    setList(data);
  }; 

  const validate = () => {
    let isValid = true;
    let tmpErr = [];

    if (!form.chapter) {
      tmpErr.push("장을 입력해주세요.");
      isValid = false;
    } else if (form.chapter < 1) {
      tmpErr.push("장을 정확히 입력해주세요.");
      isValid = false;
    }

    if (!form.verse) {
      tmpErr.push("절을 입력해주세요.");
      isValid = false;
    } else if (form.verse < 1) {
      tmpErr.push("절을 정확히 입력해주세요.");
      isValid = false;
    }
    if (!form.text) {
      tmpErr.push("구절을 입력해주세요.");
      isValid = false;
    }

    setErrors(tmpErr);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) {
        return;
      } 
 
      const {testament, ...dataToSend} = form; 
      try {
        const data = await BibleApi.create(dataToSend);
        alert("저장되었습니다!"); 

        await loadData();

        //함수형 업데이트 적용
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
  const onClickSearchButton = async (e) => {
    e.preventDefault(); 
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
                      rows="3"
                      onChange={handleChange}
                      value={form.text}
                    ></textarea>
                  </div>

                  <div className="col-md-12 d-flex justify-content-end">
                    {errors.map((e, index) => (
                      <p key={index} className="text-danger me-3">
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
                    <button type="submit" className="btn btn-primary">
                      저장
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <BibleList value={list}></BibleList>
          </div>
        </div>
      </div>
    </>
  );
};

export default BibleForm;
