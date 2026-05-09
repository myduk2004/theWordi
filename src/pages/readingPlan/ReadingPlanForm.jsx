import { useRef, useState, useEffect } from "react";  
import { todayYMD } from '../../util/common.js';
import { readingPlanApi } from "../../api/readingPlanApi";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";  
import PlanBookTodo from "../../components/PlanBookTodo"; 

const ReadingPlanForm = () =>{
 
const [show, setShow] = useState(false); 
const [planForm, setPlanForm] = useState({
    planId : null,
    versionId : "KSKJB", 
    title : "", 
    startDt : todayYMD()
});
const [errorPlan, setErrorPlan] = useState({ 
    versionId : false, 
    title : false,
    startDt : false
});
 
const [plans, setPlans] = useState([]);
const [selectedPlan, SetSelectedPlan] = useState({
    planId :18, 
    versionId : "KSKJB"
});

const loadData = async(planId, versionId) => {
    try 
    { 
        const list = await readingPlanApi.getAll();              
        setPlans(list);  

        //선택된 계획 처리(저장,수정,삭제 & 책 읽기 등록 후 갱신)
        if (planId == null || versionId == null)
        {
           planId = list?.at(-1)?.planId??0;
           versionId = list?.at(-1)?.versionId??""
        }
        
        SetSelectedPlan({
            planId : planId, 
            versionId : versionId 
        });   
    }
    catch(err)
    {
        console.error("데이터 로드 실패", err);
    }  
}

useEffect(()=>{  
    loadData(null, null);
}, [])

const onClickSavePlan = async() =>{   
  
    const newError = {
        versionId : planForm.versionId.trim() === "", 
        title :  planForm.title.trim() === "", 
        startDt : planForm.startDt.trim() === ""
    };
    setErrorPlan(newError);
     
    const hasError = newError.versionId || newError.title || newError.startDt;
    if (hasError) return;

    try 
    {
       let res;
        if (planForm.planId === null) {
            res = await readingPlanApi.create(planForm); 
            loadData(null, planForm.versionId); 
        } else {
            await readingPlanApi.update(planForm);
            loadData(planForm.planId, planForm.versionId);
        }
    }
    catch(err)
    {
        console.error("저장 중 오류 발생", err);
    } 

    handleClose(); 
}
 
const handleChangePlan = (e) =>{
    const {name, value}   = e.target;
    setPlanForm({
        ...planForm, 
        [name] : value
    });
} 


const handleShow = () => setShow(true);

const handleClose = (e) =>{
    setShow(false); 
    setErrorPlan({versionId : false, title :  false, startDt : false}); 
     
    setPlanForm({
        planId : null,
        versionId : "KSKJB", 
        title : "", 
        startDt : todayYMD()
    });
}

const handleEdit = (planId, versionId, title, startDt) =>{ 
 
    setPlanForm({
        planId : planId,
        versionId :versionId, 
        title : title, 
        startDt : startDt
    }); 

    handleShow();
} 

const handleDelete = async() =>{
    if (planForm.planId == null || planForm.planId < 1) return;
    if (!confirm("삭제하시겠습니까?")) return;

    try 
    {
        await readingPlanApi.delete(planForm.planId);
        loadData(null, null);  
    }
    catch(err)
    {
         console.error("삭제 중 오류 발생", err);
    }  
    handleClose();
}

 
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
                                        <button type="button" className="btn p-0 me-2 text-white" onClick={handleShow}>
                                            <i className="bi bi-pencil fs-4"></i> 시작하기
                                        </button> 
                                    </div> 
                                    {/* --- React Bootstrap Modal 영역 --- */}
                                    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
                                        <Modal.Header closeButton>
                                            <Modal.Title className="fs-5">성경 읽기 계획 추가</Modal.Title>
                                        </Modal.Header>
                                        
                                        <Modal.Body>
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>성경 버전</Form.Label>
                                                    <Form.Select 
                                                        name="versionId" 
                                                        value={planForm.versionId} 
                                                        onChange={handleChangePlan}
                                                        isInvalid={errorPlan.versionId}
                                                    >
                                                        <option value="KSKJB">표준 킹제임스성경</option>
                                                        <option value="KJVKO">킹제임스흠정역</option>
                                                        <option value="NKRV">개역개정</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        제목 {errorPlan.title && <span className="text-danger ms-2 small">필수 입력입니다.</span>}
                                                    </Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="title" 
                                                        placeholder=""
                                                        value={planForm.title} 
                                                        onChange={handleChangePlan}
                                                        isInvalid={errorPlan.title} // 에러 시 빨간 테두리 자동 적용
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>시작일</Form.Label>
                                                    <Form.Control 
                                                        type="date" 
                                                        name="startDt" 
                                                        value={planForm.startDt} 
                                                        onChange={handleChangePlan}
                                                        isInvalid={errorPlan.startDt}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>

                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>닫기</Button>                                            
                                            <Button variant="primary" onClick={onClickSavePlan}>저장</Button>
                                            <Button variant="danger" size="sm" onClick={handleDelete}><i className="bi bi-trash me-1"></i> 삭제</Button>
                                        </Modal.Footer>
                                    </Modal>   
                                 </div>
                            </div>
                            <div className="card-body">  
                                {plans != null && plans.map((d, index) => {

                                    const progress = d.bookCount == 0?0:(d.bookCount/66 * 100).toFixed(1);
                                   
                                    return (
                                    <div className="row g-3 mb-2 flex-nowrap align-items-center" key={d.planId}>  
                                        <div className="col-2 text-nowrap" 
                                        style={{cursor: 'pointer'}} 
                                        onClick={() => handleEdit(d.planId, d.versionId, d.title, d.startDt)}>{index+1}회차</div>
                                        <div className="col-auto text-nowrap">{d.startDt} ~ {d.endDt}</div>  
                                        <div className="col-2 text-nowrap text-primary">{progress}% 
                                            {d.status === "PROCEEDING" && <span className="badge text-bg-info"><i className="bi bi-person-walking"></i>진행중</span>}
                                            {d.status === "ABANDONED" && <span className="badge text-bg-warning"><i className="bi bi-person-walking"></i>중단</span>}
                                        </div>   
                                    </div> 
                                    )
                                })} 

                            </div>
                        </div>
                    </div>
                </div> 
            </div>

            <PlanBookTodo 
            planId={selectedPlan.planId}  
            versionId={selectedPlan.versionId}
            refreshList={loadData}
            /> 
        </div>
 
 

        {/* modal2  start */} 
        <div className="modal fade" id="listModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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