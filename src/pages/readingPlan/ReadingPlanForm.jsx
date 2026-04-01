const ReadingPlanForm = () =>{

return ( 
    <div className="container px-4 mt-5 mb-5"> 
        <div className="row gx-4 justify-content-center">
            <div className="col-lg-9 mb-2">
                {/* <h4><i className="bi bi-lightbulb"></i>   계획</h4>   */}
                <h4>
                    {/* <i className="bi bi-clock"></i> */}
                    <i className="bi bi-alarm"></i> 계획</h4>   
            </div>

            <div className="col-lg-9"> 
                <div className="row row-cols-1 row-cols-md-1 mb-3"> 
                    <div className="col">
                        <div className="card mb-4 rounded-3 shadow-sm border-primary">
                            <div className="card-header text-bg-primary border-primary"> 
                                 <div className="row g-3 align-items-center">
                                    <div className="col-md-9">
                                        <h5 className="my-0 fw-normal">성경 4번째 읽기</h5> 
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            3+
                                            <span> 진행중</span> 
                                        </span>
                                    </div>
                                    <div className="col-md-3 text-end"> 
                                        <button type="button" className="btn p-0 me-2 text-white"
                                        data-bs-toggle="modal" data-bs-target="#exampleModal" 
                                        data-bs-whatever="@mdo"> 
                                            <i className="bi bi-pencil fs-4"></i>시작하기 </button>   
                                    </div> 
                                 </div>
                            </div>
                            <div className="card-body"> 
                                <div className="row g-3 mb-2 flex-nowrap align-items-center">  
                                    <div className="col-2 text-nowrap">1회차</div>
                                    <div className="col-auto text-nowrap">2025.01.01 ~ 2025.03.30</div>  
                                    <div className="col-2 text-nowrap text-primary">70%</div> 
                                </div> 

                                <div className="row g-3 mb-2 flex-nowrap align-items-center">  
                                    <div className="col-2 text-nowrap">2회차</div>
                                    <div className="col-auto text-nowrap">2025.01.01 ~ 2025.03.30</div>  
                                    <div className="col-2 text-nowrap text-primary">30%</div> 
                                </div> 

                                <div className="row g-3  mb-2  flex-nowrap align-items-center">  
                                    <div className="col-2 text-nowrap">3회차</div>
                                    <div className="col-auto text-nowrap">2025.01.01 ~ 2025.03.30</div>  
                                    <div className="col-2 text-nowrap text-primary">100%</div> 
                                </div> 

                                <div className="row g-3  mb-2  flex-nowrap align-items-center">  
                                    <div className="col-2 text-nowrap">4회차</div>
                                    <div className="col-auto text-nowrap">2025.01.01 ~ </div>  
                                    <div className="col-2 text-nowrap text-info fw-bold"><span className="badge text-bg-info"><i className="bi bi-person-walking"></i>진행중</span></div> 
                                </div> 
                            </div>
                        </div>
                    </div>
                </div> 
            </div>

            <div className="col-lg-9">  
                <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header">

                        <div className="row g-3 align-items-center">
                            <div className="col-md-10">
                                <h5 className="my-0 fw-normal">진행목록</h5> 
                            </div>
                            <div className="col-md-2 text-end"> 
                                 <button type="button" className="btn p-0 me-2 "
                                data-bs-toggle="modal" data-bs-target="#listModal"> 
                                <i className="bi bi-list"></i>
                                </button> 

                                <button type="button" className="btn p-0 me-2 "
                                data-bs-toggle="modal" data-bs-target="#exampleModal" 
                                data-bs-whatever="@mdo"> 
                                    {/* <i className="bi bi-pencil fs-4"></i> */}
                                    <i className="bi bi-plus-lg"></i> 추가 </button>  
                                     
                            </div>  
                        </div> 
                    </div> 
                    <div className="card-body"> 
                            <div className="row g-3">  
                                <div className="col-2">창세기</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-success" style={{width: "75%"}}>75%</div>
                                    </div> 
                                </div>  
                            </div>  

                            <div className="row g-3">  
                                <div className="col-2">출애굽기</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-info" style={{width: "15%"}}>15%</div>
                                    </div> 
                                </div> 
                            </div>  


                            <div className="row g-3">  
                                <div className="col-2">마태복음</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning" style={{width: "55%"}}>55%</div>
                                    </div> 
                                </div> 
                            </div>  

                             <div className="row g-3">  
                                <div className="col-2">요한복음</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-danger" style={{width: "95%"}}>95%</div>
                                    </div> 
                                </div> 
                            </div> 
                        
                    </div>
                </div>
                    
            </div>


            <div className="col-lg-9">  
                <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3"> 
                    <h5 className="my-0 fw-normal">완료목록  </h5>
                    </div>
                    <div className="card-body"> 
                            <div className="row g-3">  
                                <div className="col-2">창세기</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-primary-subtle text-primary-emphasis" style={{width: "100%"}}>2025.01.30 ~ 2026.01.30</div>
                                    </div> 
                                </div> 
                               
                            </div>  

                            <div className="row g-3">  
                                <div className="col-2">출애굽기</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-primary-subtle text-primary-emphasis" style={{width: "100%"}}>2025.01.30 ~ 2026.01.30</div>
                                    </div> 
                                </div> 
                            </div>  


                            <div className="row g-3">  
                                <div className="col-2">마태복음</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-primary-subtle text-primary-emphasis" style={{width: "100%"}}>2025.01.30 ~ 2026.01.30</div>
                                    </div> 
                                </div> 
                            </div>  

                             <div className="row g-3">  
                                <div className="col-2">요한복음</div>
                                <div className="col-10">
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-primary-subtle text-primary-emphasis" style={{width: "100%"}}>2025.01.30 ~ 2026.01.30</div>
                                    </div> 
                                </div> 
                            </div> 
                        
                    </div>
                </div>
                    
            </div>
        </div>

        {/* modal1  start */} 
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">성경</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form> 

                            {/* <div className="mb-3 row">
                            <label for="staticEmail" className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                            <input type="text" readonly className="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
                            </div>
                            </div>
                            <div className="mb-3 row">
                            <label for="inputPassword" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                            <input type="password" className="form-control" id="inputPassword"></input>
                            </div>
                            </div> */}


                             <div className="mb-3"> 
                                <label htmlFor="bibleVersion" className="col-form-label">성경</label>  
                                <select className="form-select" id="bibleVersion"> 
                                <option value="1">표준 킹제임스성경</option>
                                <option value="2">킹제임스흠정역</option>
                                <option value="3">개역개정</option>
                                </select>
                            </div> 

                            <div className="mb-3"> 
                                <label htmlFor="recipient-name3" className="col-form-label">신/구약</label> 
                                <select className="form-select" id="recipient-name3" aria-label="Default select example"> 
                                <option value="1" selected>신약</option>
                                <option value="2">구약</option> 
                                </select> 
                            </div>

                             <div className="mb-3"> 
                                <label htmlFor="recipient-name34" className="col-form-label">책</label> 
                                <select className="form-select" id="recipient-name34" aria-label="Default select example"> 
                                <option value="1" selected>마태복음</option>
                                <option value="2">마가복음</option> 
                                <option value="2">누가복음</option> 
                                </select>
                            </div> 

                            <div className="mb-3">
                                <label htmlFor="chapter-input" className="form-label d-block">장</label>
                                <div className="d-flex align-items-center">
                                    <input type="text" className="form-control" id="chapter-start" placeholder="1" style={{ width: '100px' }} /> 장
                                    <span className="mx-2">-</span>
                                    <input type="text" className="form-control" id="chapter-end" placeholder="1" style={{ width: '100px' }} /> 장
                                </div>
                            </div> 
 

                             <div className="mb-3"> 
                                <label htmlFor="cal1" className="col-form-label">시작일</label>  
                                <input type="date" id="cal1" className="form-control" />  
                            </div>
                             <div className="mb-3"> 
                                <label htmlFor="cal1" className="col-form-label">완료일</label>  
                                <input type="date" id="cal1" className="form-control" />  
                            </div> 

                            
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                        <button type="button" className="btn btn-primary">저장</button>
                    </div>
                </div>
            </div>
        </div>
        {/* modal1  end */} 

        {/* modal2  start */} 
        <div className="modal fade" id="listModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
               
<div className="modal-body p-0">

  
  <div className="d-flex px-4 py-2 bg-light border-bottom">
    <span className="flex-fill text-uppercase text-muted" style={{fontSize:"11px", letterSpacing:".06em"}}>A</span>
    <span className="flex-fill text-uppercase text-muted" style={{fontSize:"11px", letterSpacing:".06em"}}>B</span>
    <span className="flex-fill text-uppercase text-muted" style={{fontSize:"11px", letterSpacing:".06em"}}>C</span>
    <span className="flex-fill text-uppercase text-muted" style={{fontSize:"11px", letterSpacing:".06em"}}>D</span>
  </div>

   
  <ul className="list-group list-group-flush">
    <li className="list-group-item list-group-item-action d-flex align-items-center">
      <span className="flex-fill">항목 1</span>
      <span className="flex-fill">값 B-1</span>
      <span className="flex-fill"><span className="badge rounded-pill text-bg-primary">진행중</span></span>
      <span className="flex-fill text-muted small">2024.01.01</span>
    </li>
    <li className="list-group-item list-group-item-action d-flex align-items-center">
      <span className="flex-fill">항목 2</span>
      <span className="flex-fill">값 B-2</span>
      <span className="flex-fill"><span className="badge rounded-pill text-bg-success">완료</span></span>
      <span className="flex-fill text-muted small">2024.02.15</span>
    </li>
    <li className="list-group-item list-group-item-action d-flex align-items-center">
      <span className="flex-fill">항목 3</span>
      <span className="flex-fill">값 B-3</span>
      <span className="flex-fill"><span className="badge rounded-pill text-bg-warning">대기</span></span>
      <span className="flex-fill text-muted small">2024.03.08</span>
    </li>
    
  </ul>

</div>


                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Understood</button>
                </div>
                </div>
            </div>
        </div>
        {/* modal2  end */} 


    </div> 
);
    
}

export default ReadingPlanForm