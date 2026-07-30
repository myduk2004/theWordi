import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MeditationApi } from "../../api/meditationApi";

const MeditationList = () => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [searchOption, setSearchOption] = useState({
    searchItem: "title",
    keyword: "",
    startDate: "",
    endDate: "",
  });

  const [appliedSearch, setAppliedSearch] = useState(searchOption);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["meditations", appliedSearch], // appliedSearch가 바뀌면 자동 재조회
    queryFn: ({ pageParam }) =>
      MeditationApi.getList({
        title: appliedSearch.searchItem === "title" ? appliedSearch.keyword : "",
        bibleText: appliedSearch.searchItem === "bibleText" ? appliedSearch.keyword : "",
        etcText: appliedSearch.searchItem === "etcText" ? appliedSearch.keyword : "",
        startDate: appliedSearch.startDate,
        endDate: appliedSearch.endDate,
        page: pageParam,
        size: 6,
      }),
    initialPageParam: 0,
    // 다음 페이지 번호를 어떻게 계산할지: 마지막 페이지면 undefined(더 없음), 아니면 다음 인덱스
    getNextPageParam: (lastPage, allPages) => (lastPage.last ? undefined : allPages.length),
  });

  // data.pages는 [ {content: [...], last: false}, {content: [...], last: true} ] 형태
  const list = data?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [page, setPage] = useState(0);

  const onClickMove = (id) => {
    if (id > 0) {
      navigate(`/meditations/${id}`);
    } else {
      navigate(`/meditations/new`);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setSearchOption({
      ...searchOption,
      [name]: value,
    });
  };

  const onClickSearch = () => {
    setAppliedSearch(searchOption);
  };

  return (
    <div className="container px-4 mt-5 mb-5">
      <div className="row gx-4 justify-content-center">
        <div className="col-lg-9">
          <div className="row mb-2">
            <div className="col">
              <h4>
                <i className="bi bi-lightbulb text-warning fs-3"></i> 묵상
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-9" id="divSearch">
          <div className="row mb-2 text-left">
            <div className="col">
              <div className="card mb-4 rounded-3 shadow-sm">
                <div className="card-header py-3">
                  <div className="row g-3">
                    <div className="col-md-2">
                      <select
                        className="form-select"
                        name="searchItem"

                        value={searchOption.searchItem}
                        onChange={onChange}
                      >
                        <option value="title">제목</option>
                        <option value="bibleText">성경 묵상구절</option>
                        <option value="etcText">성경외 묵상구절</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        name="keyword"
                        value={searchOption.keyword}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onClickSearch();
                        }}
                        onChange={onChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={searchOption.startDate}
                        onChange={onChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={searchOption.endDate}
                        onChange={onChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn p-0 me-2 text-primary"
                        onClick={onClickSearch}
                      >
                        <i className="bi bi-search fs-5"></i>
                      </button>
                      <button
                        type="button"
                        className="btn p-0 me-2 text-primary"
                        onClick={() => onClickMove(0)}
                      >
                        <i className="bi bi-pencil fs-4"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          {!isLoading && list?.length < 1 && (
            <div className="row row-cols-1 row-cols-md-1 mb-3">
              <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                  <div className="card-body py-3 bg-primary-subtle text-primary-emphasis">
                    <h6 className="my-0 fw-normal">
                      <i className="bi bi-exclamation-circle"></i> 조회된 데이터가 없습니다.
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row row-cols-1 row-cols-md-3 mb-3">
            {list.map((d, idx) => {
              return (
                <div className="col d-flex" key={d.meditationId}>
                  <div className="card mb-4 rounded-3 shadow-sm  w-100 d-flex flex-column">
                    <div className="card-header py-3 text-center">
                      <h6 className="my-0 fw-normal">
                        {d.title.length > 10 ? d.title.substring(0, 30) + "..." : d.title}
                      </h6>
                    </div>
                    <div
                      className="card-body  d-flex flex-column"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      <small className="mb-2">
                        {d.bibleText.length > 200
                          ? d.bibleText.substring(0, 200) + "..."
                          : d.bibleText}
                      </small>

                      <small className="mb-4">
                        {d.etcText.length > 200 ? d.etcText.substring(0, 200) + "..." : d.etcText}
                      </small>

                      <button
                        type="button"
                        className="w-100 btn btn-lg btn-outline-primary mt-auto"
                        onClick={() => onClickMove(d.meditationId)}
                      >
                        {d.meditationDt}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={observerRef} />
          {(isLoading || isFetchingNextPage) && (
            <div className="text-center my-3">
              <div className="spinner-border m-5" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!hasNextPage && list.length > 0 && (
            <div className="text-center my-3">
              <p>
                <mark>마지막 페이지입니다.</mark>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeditationList;
