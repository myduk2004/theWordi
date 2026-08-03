import { useContext, useState, memo } from "react";

const BibleLists = ({ verses }) => {
  const [selectedRowIdx, setSelectedRowIdx] = useState(null);
  const [isSelectedRow, setSelectedRow] = useState(false);
  const handleMouseDown = (idx) => {
    if (selectedRowIdx === idx) setSelectedRowIdx(null);
    else setSelectedRowIdx(idx);
  };
  return (
    <>
      <div className={`row row-cols-1 row-cols-md-${Math.min(verses?.length ?? 1, 6)} mb-3`}>
        {verses?.length === 0 && (
          <div className="col">
            <div className="card mb-4 rounded-3 shadow-sm">
              <div className="card-body py-3 bg-primary-subtle text-primary-emphasis">
                <h6 className="my-0 fw-normal">
                  <i className="bi bi-exclamation-circle"></i> 조회된 데이터가 없습니다.
                </h6>
              </div>
            </div>
          </div>
        )}

        {verses?.map((data, idx) => {
          return (
            <div className="col" key={data.bibleVersion.versionId}>
              <div className={`card mb-4 rounded-3 shadow-sm ${idx === 0 ? "border-primary" : ""}`}>
                <div
                  className={`card-header py-3 text-center ${idx === 0 ? "text-bg-primary border-primary" : ""}`}
                >
                  <h4 className="my-0 fw-normal">{data.bibleVersion.versionName}</h4>
                </div>
                <div className="card-body">
                  {data.verses?.map((verse, rowIdx) => {
                    let titleAlign = "";
                    if (verse.subTitle && verse.bookId === 19 && verse.chapter === 119)
                      titleAlign = "text-center";

                    let verseText = verse.text;
                    if (verse.verse < 999) {
                      const match_verse = verseText.match(/^#VERSE_TO_(\d+)#/);
                      const verseTo = match_verse ? match_verse[1] : "";
                      if (verseTo != "") {
                        verseText =
                          verse.verse +
                          "-" +
                          verseTo +
                          "  " +
                          verseText.replace(match_verse[0], "");
                      } else {
                        verseText =
                          verse.verse +
                          (data.bibleVersion.versionId === "NKRV" ||
                          data.bibleVersion.versionId === "RNKSV"
                            ? "  "
                            : ". ") +
                          verseText;
                      }
                    }

                    return (
                      <div className="card-text" key={verse.verseId}>
                        {verse.subTitle && (
                          <h6 className={`${titleAlign} mt-2 mb-4`}>{verse.subTitle}</h6>
                        )}
                        <p
                          onMouseDown={() => handleMouseDown(rowIdx)}
                          style={{
                            backgroundColor: selectedRowIdx === rowIdx ? "#FFF6D6" : "white",
                            cursor: "pointer",
                          }}
                        >
                          {verseText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default memo(BibleLists);
