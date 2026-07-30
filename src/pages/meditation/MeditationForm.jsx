import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MeditationApi } from "../../api/meditationApi";
import BibleSearch from "../../components/BibleSearch";
import { todayYMD } from "../../util/common.js";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const MeditationForm = () => {
  const navigate = useNavigate();
  const { meditationId } = useParams();
  const editorRef = useRef(null);
  const queryClient = useQueryClient();

  const [verses, setVerses] = useState([]);
  const [form, setForm] = useState({
    meditationDt: todayYMD(),
    title: "",
    etcText: "",
    etcSource: "",
  });
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({
    meditationDt: false,
    title: false,
    content: false,
  });

  const { data, isSuccess } = useQuery({
    queryKey: ["meditation", meditationId],
    queryFn: () => MeditationApi.getOne(meditationId),
    enabled: !!meditationId,
  });

  useEffect(() => {
    if (!isSuccess || !data) return;

    if (data.bibleVerses != null) {
      const myVerses = data.bibleVerses
        .filter((v) => v.verses && v.verses.length > 0)
        .flatMap((v) => v.verses);
      setVerses(myVerses);
    }

    setForm({
      meditationDt: data.meditationDt,
      title: data.title,
      etcText: data.etcText,
      etcSource: data.etcSource,
    });

    setContent(data.text || "");
  }, [isSuccess, data]);

  const saveMutation = useMutation({
    mutationFn: (formData) =>
      meditationId ? MeditationApi.update(formData) : MeditationApi.create(formData),
    onSuccess: (res) => {
      if (res.meditationId) {
        queryClient.invalidateQueries({ queryKey: ["meditations"] });
        if (res.meditationId) {
          queryClient.invalidateQueries({ queryKey: ["meditation", meditationId] });
        }
        navigate(`/meditations/${res.meditationId}`);
      } else {
        alert("저장 중 오류가 발생했습니다.");
      }
    },
    onError: (err) => {
      console.err("저장 중 오류 발생", err);
    },
  });

  const handleSubmit = async () => {
    const currentContent = editorRef.current?.getHTML() || "";

    if (!validate(currentContent)) {
      return;
    }

    const bibleText = verses
      .map((v) => `${v.text} (${v.bookName} ${v.chapter}:${v.verse})`)
      .join("\n");

    const verseIds = verses.map((v) => v.verseId);

    if (
      (verseIds == null || verseIds.length < 1) &&
      (form.etcText === "" || form.etcSource === "")
    ) {
      alert(
        "묵상구절을 입력해 주세요.\n'성경 묵상구절' 또는 '묵상구절(성경 외)' 중 하나는 반드시 입력해야 합니다."
      );
      return;
    }

    const formData = {
      ...form,
      bibleText: bibleText,
      text: currentContent,
      ...(meditationId && { meditationId }),
      verseIds: verseIds,
    };

    saveMutation.mutate(formData);
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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              <i className="bi bi-lightbulb text-warning fs-3"></i> 묵상
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

                  <div className="col-md-12 mt-4">
                    묵상구절<small className="text-primary fst-italic"> - 성경</small>
                  </div>
                  <BibleSearch onSelect={addVerse}></BibleSearch>

                  <div className="col-md-12">
                    <div className="bd-callout bd-callout-info">
                      {verses.length === 0 && (
                        <span className="small text-muted">- 선택된 성경 묵상구절이 없습니다.</span>
                      )}

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
                            onClick={() =>
                              setVerses((prev) => prev.filter((d) => d.verseId !== v.verseId))
                            }
                          >
                            del
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <small className="text-primary fst-italic"> - 성경 외의 묵상구절</small>
                    <input
                      type="text"
                      className="form-control mb-3"
                      name="etcSource"
                      placeholder="출처"
                      value={form.etcSource}
                      onChange={handleChange}
                    />

                    <textarea
                      className="form-control"
                      id="etcText"
                      name="etcText"
                      placeholder="묵상구절"
                      rows="2"
                      value={form.etcText}
                      onChange={handleChange}
                    ></textarea>
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
                      목록
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? "저장 중..." : "저장"}
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
