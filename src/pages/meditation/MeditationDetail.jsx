import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import EditorView from "../../components/EditorView";
import { MeditationApi } from "../../api/meditationApi";
import { formatDateKr } from "../../util/common.js";
import DOMPurify from "dompurify";

const MeditationDetail = () => {
  const navigate = useNavigate();
  const { meditationId } = useParams();
  const [meditationDt, setMeditationDt] = useState("");
  const [title, setTitle] = useState("");
  const [bibleText, setBibleText] = useState("");
  const [etcText, setEtcText] = useState("");
  const [etcSource, setEtcSource] = useState("");
  const [content, setContent] = useState("");

  const [form, setForm] = useState({
    title,
    meditationDt,
    bibleText,
    etcText,
    etcSource,
    content,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await MeditationApi.getOne(meditationId);
        setForm({
          title: data.title,
          meditationDt: formatDateKr(data.meditationDt),
          bibleText: data.bibleText,
          etcText: data.etcText,
          etcSource: data.etcSource,
          content: data.text,
        });
      } catch (error) {
        console.error("데이터로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };
    if (meditationId) {
      loadData();
    }
  }, [meditationId]);

  const handleClick = (e) => {
    const { name, value } = e.target;
    if (name === "edit") {
      navigate(`/meditations/${meditationId}/edit`);
    } else {
      navigate(`/meditations`);
    }
  };

  const handleDelete = async () => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        await MeditationApi.delete(meditationId);
        alert("삭제되었습니다.");
        navigate(`/meditations`);
      } catch (err) {
        console.error("삭제 중 오류 발생", err);
      }
    }
  };

  if (loading && !content) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mt-5 mb-5">
      <div className="row gx-4 justify-content-center">
        <div className="col-lg-9 mb-2">
          <h4>
            <i className="bi bi-lightbulb text-warning fs-3"></i> 묵상
          </h4>
        </div>

        <div className="col-lg-9">
          <div className="card mb-4">
            <div className="card-header">
              <h5>{form.title}</h5>
              <small>{form.meditationDt}</small>
            </div>
            <div className="card-body">
              <form className="row g-3">
                <div className="col-md-12 mt-4">
                  묵상구절<small className="text-primary fst-italic"> - 성경</small>
                </div>

                <div className="col-md-12">
                  <div className="alert alert-info" style={{ whiteSpace: "pre-line" }}>
                    {form.bibleText}
                  </div>
                </div>

                <div className="col-md-12">
                  <small className="text-primary fst-italic"> - 성경 외의 묵상구절</small>
                  <div className="alert alert-warning" style={{ whiteSpace: "pre-line" }}>
                    {form.etcText} - <small>{form.etcSource}</small>
                  </div>
                </div>

                <div className="col-md-12">
                  <div
                    className="tiptap-viewer"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(form.content),
                    }}
                  />
                </div>

                <div className="col-md-12 d-flex justify-content-end align-items-center">
                  <button type="button" onClick={handleClick} className="btn btn-primary me-2">
                    목록
                  </button>
                  <button
                    type="button"
                    name="edit"
                    onClick={handleClick}
                    className="btn btn-primary me-2"
                  >
                    수정
                  </button>
                  <button type="button" onClick={handleDelete} className="btn btn-danger">
                    삭제
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationDetail;
