import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MeditationApi } from "../../api/meditationApi";
import BibleSearch from "../../components/BibleSearch";
import { todayYMD } from "../../util/common.js";
import { useNavigate } from "react-router-dom";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const MeditationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { meditationId } = useParams();
  const editorRef = useRef(null);
  const [verses, setVerses] = useState([]);

  const [form, setForm] = useState({
    meditationDt: todayYMD(),
    title: "",
  });
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({
    meditationDt: false,
    title: false,
    content: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await MeditationApi.getOne(meditationId);
        setForm({
          meditationDt: data.meditationDt,
          title: data.title,
        });
        setContent(data.text || "");
      } catch (err) {
        console.error("데이터 로드 실패 : ", err);
      }
    };

    if (meditationId) {
      loadData();
    }

    setLoading(false);
  }, [meditationId]);

  const handleSubmit = async () => {
    if (loading) return;

    const currentContent = editorRef.current?.getHTML() || "";
    const verseIds = [];
    let match;

    if (!validate(currentContent)) {
      return;
    }

    const formData = {
      ...form,
      text: currentContent,
      ...(meditationId && { meditationId }),
      verseIds,
    };

    try {
      const res = await (meditationId
        ? MeditationApi.update(formData)
        : MeditationApi.create(formData));

      if (res.meditationId) {
        navigate(`/meditations/${res.meditationId}`);
      } else {
        alert("저장 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("저장 중 오류 발생", err);
    }
  };

  const validate = (currentContent) => {
    const newErrors = {
      meditationDt: !form.meditationDt,
      title: !form.title || form.title.trim() === "",
      content: !currentContent || currentContent.trim() === "",
    };

    setErrors(newErrors);

    return !newErrors.meditationDt && !newErrors.title && !newErrors.content;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const addVerse = ({
    versionId,
    versionName,
    bookId,
    bookName,
    verseId,
    chapter,
    verse,
    text,
  }) => {
    setVerses((prev) => {
      if (prev.some((v) => v.verseId === verseId)) {
        return prev;
      }

      return [
        ...prev,
        {
          versionId,
          versionName,
          bookId,
          bookName,
          verseId,
          chapter,
          verse,
          text,
        },
      ];
    });
  };

  return (
    <>
      <div className="container px-4 mt-5 mb-5">
        <div className="row gx-4 justify-content-center">
          <div className="col-lg-9 mb-2">
            <h4>
              <i className="bi bi-lightbulb"></i> 묵상
            </h4>
          </div>

          <div className="col-lg-9">
            <div className="card mb-4">
              <div className="card-header">킹제임스 표준역 {">"} 창세기</div>
              <div className="card-body">
                <form className="row g-3">
                  <div className="col-md-2">
                    <input
                      type="date"
                      className={`form-control ${errors.meditationDt ? "is-invalid" : ""}`}
                      name="meditationDt"
                      placeholder="날짜"
                      onChange={handleChange}
                      value={form.meditationDt}
                    />{" "}
                    <div className="invalid-feedback">날짜를 선택해주세요.</div>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      name="title"
                      placeholder="제목을 입력해주세요"
                      onChange={handleChange}
                      value={form.title}
                    />
                  </div>

                  <BibleSearch onSelect={addVerse}></BibleSearch>

                  <div className="col-md-12">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">
                      성경 묵상구절
                    </label>

                    <div className="bd-callout bd-callout-info">
                      {verses.map((v, index) => (
                        <div
                          key={index}
                          className="d-flex justify-content-between align-items-center  py-2"
                        >
                          <span>
                            {v.text}({v.bookName}
                            {v.chapter}:{v.verse})
                          </span>
                          <span
                            className="text-danger ms-3 p-1"
                            role="button"
                            onMouseOver={(e) => (e.target.style.opacity = 0.7)}
                            onMouseOut={(e) => (e.target.style.opacity = 1)}
                            style={{ fontSize: "10px", cursor: "pointer" }}
                            onClick={() => setVerses(verses.filter((d) => d.verseId !== v.verseId))}
                          >
                            del
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlTextarea1" className="form-label">
                        묵상구절
                      </label>

                      <input
                        type="text"
                        className={`form-control mb-3`}
                        name="etc_text_source"
                        placeholder="출처"
                      />

                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        placeholder="묵상구절"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="border rounded overflow-hidden">
                      <SimpleEditor ref={editorRef} content={content} onChange={setContent} />
                    </div>
                  </div>

                  <div className="col-md-12 d-flex justify-content-end align-items-center">
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={() => navigate(`/meditations`)}
                    >
                      목록{" "}
                    </button>
                    <button type="button" onClick={handleSubmit} className="btn btn-primary">
                      저장
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeditationForm;
