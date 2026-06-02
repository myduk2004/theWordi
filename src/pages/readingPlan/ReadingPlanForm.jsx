import { useRef, useState, useEffect } from "react";  
import { todayYMD } from '../../util/common.js';
import { readingPlanApi } from "../../api/readingPlanApi";
import { Modal, Button, Form, Row, Col, InputGroup, ListGroup, Badge } from "react-bootstrap";  
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
    planId :0, 
    versionId : "", 
    readCount : 0, 
    title : "" 
});

const loadData = async(planId, versionId) => {
    try 
    { 
        const list = await readingPlanApi.getAll();              
        setPlans(list);   
 
        //case1: plan 이 삭제, 새로 저장 시 -> 마지막 Row 선택 
        //case2: plan 이 update, book 새로저장/삭제/update 시 --> 기존 Row 선택  
        let selected_planId = selectedPlan.planId;
        let selected_versionId = selectedPlan.versionId; 
        let selected_readCount = selectedPlan.readCount;   
        if (planId == 0 || planId != selectedPlan.planId)
        { 
            //처음 plan 등록시  selectedPlan.planId <> new_plan_id
            //row 선택된 상태에서 새로 plan 등록시 selectedPlan.planId <> new_plan_id
            //plan 삭제 후 plan_id=0, selectedPlan.planId > 0         
            selected_planId = list?.at(-1)?.planId??0;
            selected_versionId = list?.at(-1)?.versionId??""; 
            selected_readCount = list?.at(-1)?.readCount??0;   
        }
 

        SetSelectedPlan({
            planId : selected_planId, 
            versionId : selected_versionId,
            readCount : selected_readCount  
        });   
    }
    catch(err)
    {
        console.error("데이터 로드 실패", err);
    }  
}

useEffect(()=>{    
      loadData(0, ""); 
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
            loadData(res.planId, planForm.versionId); 
            alert("저장되었습니다.");
        } else {
            await readingPlanApi.update(planForm);
            loadData(planForm.planId, planForm.versionId);
            alert("수정되었습니다.");
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
 
const onClickEditPlan = (plan) => {
    setPlanForm({
        planId : plan.planId,
        versionId : plan.versionId, 
        title : plan.title, 
        startDt : plan.startDt
    }); 

    handleShow();
};


const handleEdit = (planId, versionId, title, startDt) =>{ 
 
    setPlanForm({
        planId : planId,
        versionId :versionId, 
        title : title, 
        startDt : startDt
    }); 

    handleShow();
} 

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


const handleDelete = async() =>{
    if (planForm.planId == null || planForm.planId < 1) return;
    if (!confirm("삭제하시겠습니까? 등록된 책의 진행/완료 목록이 함께 삭제됩니다.")) return;

    try 
    {
        await readingPlanApi.delete(planForm.planId);
        loadData(0, "");  
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
                                        <h5 className="my-0 fw-normal">성경 {selectedPlan.readCount}번째 읽기</h5> 
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {(plans.filter(d => d.status === "PROCEEDING" )?.length??0)}
                                               {(plans.filter(d => d.status === "PROCEEDING" )?.length??0) && 
                                               <span>+건 진행중</span>}  
                                        </span>
                                    </div>
                                    <div className="col-md-3 text-end"> 
                                        <button type="button" className="btn p-0 me-2 text-white" onClick={handleShow}>
                                            <i className="bi bi-pencil fs-4"></i> 계획 시작하기
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
                                                        style={planForm.planId > 0?{ pointerEvents: 'none', backgroundColor: '#f8f9fa' } : null}
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
                                                        style={planForm.planId > 0?{ pointerEvents: 'none', backgroundColor: '#f8f9fa' } : null}
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

                            <ListGroup variant="flush"> 
                                {plans.map((d, index) => {
                                    const progress = d.bookCount == 0?0:(d.bookCount/66 * 100).toFixed(1); 

                                    const isActive = selectedPlan?.planId === d.planId;
                                    return ( 
                                        <ListGroup.Item 
                                            key={index}
                                            action 
                                            active={isActive}
                                            as="button" 
                                            type="button" 
                                            onClick={() =>SetSelectedPlan({
                                                planId : d.planId, 
                                                versionId : d.versionId , 
                                                readCount : d.readCount
                                            })} 
                                            className="w-100 border-0 px-4 py-3 custom-hover-item border-bottom"
                                        >  
                                            <div className="row w-100 m-0 align-items-center">
                                                <span className="col-2 text-start fw-medium p-0">{index + 1}회차</span>
                                                <span className="col-4 text-start small p-0">{d.startDt} ~ {d.endDt}</span> 
                                                <span className="col-4 text-end small p-0">{progress}%</span> 
                                                <span className="col-2 text-end small p-0">  
                                                    {/* <a className="icon-link icon-link-hover link-success link-underline-success link-underline-opacity-25" 
                                                    onClick={() => handleShow(d.planBookId, d.bookId, d.maxChapterNum)}>
                                                    edit
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="bi" viewBox="0 0 16 16" aria-hidden="true">
                                                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                                    </svg>
                                                    </a> */}
                                                    <div className="d-inline-flex align-items-center gap-2"> 
                                                        <button 
                                                            type="button" 
                                                            className="btn border-0 d-flex align-items-center justify-content-center p-0"
                                                            style={{ 
                                                            width: '24px', 
                                                            height: '24px', 
                                                            backgroundColor: '#e7f1ff', 
                                                            color: '#0d6efd',
                                                            borderRadius: '4px',
                                                            flexShrink: 0 
                                                            }}
                                                            value={d.bookId}
                                                            onClick={() => onClickEditPlan(d)}
                                                        > 
                                                            <i className="bi bi-pencil-fill" style={{ fontSize: '0.7rem' }}></i>
                                                        </button> 
                                                    </div>  
                                                </span>  
                                            </div> 
                                        </ListGroup.Item>
                                    )} 
                                )} 
                            </ListGroup> 
                        </div>
                    </div>
                </div> 
            </div>

            <PlanBookTodo 
            planId={selectedPlan.planId}  
            versionId={selectedPlan.versionId}
            readCount={selectedPlan.readCount}
            refreshList={loadData}
            /> 
        </div> 
    </div> 
);
    
}

export default ReadingPlanForm