import { useEffect, useState, useRef } from "react";  
import { Modal, Button, Form, Row, Col, InputGroup, ListGroup, Badge } from "react-bootstrap"; // 추가
import BibleBookSelect from "./BibleBookSelect";
import { todayYMD } from '../util/common.js';
import { readingBookApi } from "../api/readingBookApi";
 
//const initBookId = 1;
const initBookId = null;
const initForm = {   
    planBookId : null,
    bookId:initBookId, 
    startChapter : 1,   
    endChapter: 1, 
    maxChapterNum : 0,
    startDt:todayYMD(), 
    endDt:todayYMD()  
}   
const bgColor = ["bg-primary2", "bg-success2", "bg-info2", "bg-warning",  "bg-danger2"];  
const initBookError = {
    startChapter : false, 
    endChapter : false, 
    startDt : false,
    endDt : false,  
    chapterMsg : "",  
    dtMsg : "", 
} 
 

const PlanBookTodo = ({planId, versionId, readCount, refreshList}) =>{  
    
const  [selectedBookId, setSelectedBookId]= useState(initBookId); 
const [show, setShow] = useState(false);     
const [showList, setShowList] = useState(false);     
const [formBook, setFormBook] = useState(initForm);
const [todos, setTodos] = useState([]);
const [todoLogs, setTodoLogs] = useState([]); 
const [finished, setFinished] = useState([]);  
const [errorBook, setErrorBook] = useState(initBookError);   
const deleteLogIdRef = useRef([]); 
const loadBooks = async()=>{  
    const books = await readingBookApi.getBooks(planId, versionId);  
    setTodos(books.filter(d => d.status == "PROCEEDING"));
    setFinished(books.filter(d => d.status == "COMPLETED")); 
} 

const [selectedTodo, setSelectedTodo] = useState({
    planBookId : 0, 
    bookId:0,  
    maxChapterNum : 0, 
    bookName : "", 
    status : "",
})

useEffect(() => { 
    const loadData = async () =>{
        if (planId > 0)
        {
            await loadBooks();
        }
    }; 
    loadData();

}, [planId]); 

const handleShow = (pbid, bid, maxChapterNum) => { 

    setSelectedBookId(bid);   
    
    if (maxChapterNum > 0)
    {
        setFormBook({
            ...formBook, 
            planBookId : pbid,
            bookId:bid, 
            startChapter : maxChapterNum + 1, 
            endChapter : maxChapterNum + 1, 
            maxChapterNum : maxChapterNum
        })  
    }
    else 
    {
         setFormBook({
            ...formBook, 
            planBookId : pbid,
            bookId:bid, 
            maxChapterNum : maxChapterNum
        })
    } 
 
    setShow(true);
} 
const handleClose = (e) =>{  
    setSelectedBookId(initBookId);
    setFormBook(initForm);
    setErrorBook(initBookError);   
    setShow(false);  
} 
 
const handleListShow = async (book) => {   
   
    //planId, planBookId, bookName, maxChapterNum, bookId
    if (book.planId == null || book.planBookId == null) return;
    
    setSelectedTodo({
        planBookId : book.planBookId, 
        bookId:book.bookId,  
        maxChapterNum : book.maxChapterNum, 
        bookName : book.nameKo, 
        status : book.status,
    });
 
    try
    {
        const res = await readingBookApi.getBookLogs(book.planId, book.planBookId);    
        setTodoLogs(res);   
        setShowList(true); 
    }
    catch(err)
    { 
        const errorMsg = err?.data?.message || err.message;
        alert(errorMsg);
    }  
}

const handleListClose = (e) =>{   
    setShowList(false);  
} 

const handleListNew = (e) =>{   
    setShowList(false);    
    handleShow(selectedTodo.planBookId, selectedTodo.bookId, selectedTodo.maxChapterNum); 
} 

const handleChangeBook = (e) =>{
    const {name, value} = e.target; 
    setFormBook({
        ...formBook, 
        [name] : value
    });   
} 

const validate = () =>{ 
     
    const {startChapter, endChapter, startDt, endDt} = formBook;  
    let isOk = true;
    let err =  { ...initBookError};
    
    if (startChapter < 1 || endChapter < 1){  
        
        err.startChapter = true;
        err.endChapter = true;
        err.chapterMsg = "장 번호는 1보다 커야 합니다.";
        isOk = false;
    }

    if (parseInt(startChapter) > parseInt(endChapter))
    {  
         
        err.startChapter = true;
        err.endChapter = true;
        err.chapterMsg = "시작 장이 종료 장보다 클 수 없습니다."; 
        isOk = false;
    } 

    if (new Date(startDt) > new Date(endDt))
    {   
        err.startDt = true;
        err.endDt = true;
        err.dtMsg = "시작일이 종료일보다 늦을 수 없습니다."; 
        isOk = false;
    } 

    setErrorBook(err); 
    return isOk; 
}
const handleSaveBook = async () =>{
    
    if (!validate()) return;
    const { maxChapterNum, ...reqForm} = formBook;
 
    try
    {
        const res = await readingBookApi.create(planId, reqForm);  
        alert("등록되었습니다"); 
        handleClose(); 

        await loadBooks();
        
        if (refreshList) refreshList(planId, versionId);
    }
    catch(err)
    { 
        const errorMsg = err?.data?.message || err.message;
        alert(errorMsg);
    } 
}

const handleDelete = async() =>{

    let planBookId = 0;
    const checkeds = todoLogs.filter((item, index) =>{
        planBookId = item.planBookId;
        const el = deleteLogIdRef.current[index];
        return el && el.checked;
    }); 

    const deleteIds = checkeds.map(log => log.planLogId); 
    if (deleteIds.length < 1)
    {
        alert("삭제할 항목을 선택해주세요.");
        return;
    }

    if (!confirm("삭제하시겠습니까?")) return;

    try 
    {
        //deleteBookLogs : async (planId, planBookId, checkedLogIds) 
        const res = await readingBookApi.deleteBookLogs(planId, planBookId,  deleteIds);  
        alert("삭제되었습니다"); 
        handleListClose(); 

        await loadBooks();
        
        if (refreshList) refreshList(planId, versionId); 
        
    }
    catch(err)
    {
        const errorMsg = err?.data?.message || err.message;
        alert(errorMsg);
    } 

}
return <>
                
    <div className="col-lg-9">  
        <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header">

                <div className="row g-3 align-items-center">
                    <div className="col-md-9">
                        <h5 className="my-0 fw-normal">진행목록 - {readCount}회차</h5>  
                    </div>
                    <div className="col-md-3 text-end">  
                        <button type="button" className="btn p-0 me-2" onClick={() => handleShow(null, initBookId, 0)}>  
                            {/* <i className="bi bi-pencil fs-4"></i> */}
                            <i className="bi bi-plus-lg"></i>책 시작하기</button>    
                    </div>  


                    {/* modal  */}
                    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title className="fs-5">성경 책 추가</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body>
                            <Form>
                                <BibleBookSelect
                                versionId={versionId}   
                                bookId={selectedBookId} 
                                onChange={handleChangeBook}                                
                                ></BibleBookSelect>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>장 범위  
                                        {(formBook.maxChapterNum > 0) &&  <span className="text-danger small ms-2">({formBook.maxChapterNum +1}장부터 시작)</span>}
                                        { (errorBook.startChapter || errorBook.endChapter) && <span className="text-danger small ms-2">{errorBook.chapterMsg}</span>} 
                                    </Form.Label>  
 
                                    <InputGroup>
                                        <Form.Control  
                                            type="number" 
                                            min="1"
                                            name="startChapter" 
                                            placeholder="시작장"  
                                            onChange={handleChangeBook}
                                            value={formBook.startChapter}
                                            isInvalid={errorBook.startChapter}
                                        />
                                        <InputGroup.Text>-</InputGroup.Text> 
                                        
                                        <Form.Control  
                                            type="number" 
                                            min="1"
                                            name="endChapter" 
                                            placeholder="종료장"  
                                            onChange={handleChangeBook}
                                            value={formBook.endChapter}
                                            isInvalid={errorBook.endChapter}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>기간 설정
                                        { (errorBook.startDt || errorBook.endDt) && <span className="text-danger small ms-2">{errorBook.dtMsg}</span>} 
                                    </Form.Label>
                                    <InputGroup>
                                    
                                    <Form.Control 
                                        type="date" 
                                        name="startDt"  
                                        onChange={handleChangeBook}
                                        value={formBook.startDt}
                                        isInvalid={errorBook.startDt}
                                    />
                                    <InputGroup.Text>-</InputGroup.Text> 
                                    <Form.Control 
                                        type="date" 
                                        name="endDt"  
                                        onChange={handleChangeBook}
                                        value={formBook.endDt}
                                        isInvalid={errorBook.endDt}
                                    />
                                    </InputGroup> 
                                </Form.Group>
                            </Form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>닫기</Button>                                            
                            <Button variant="primary" onClick={handleSaveBook}>저장</Button> 
                        </Modal.Footer>
                    </Modal>  
                    {/* modal end  */} 
                </div> 
            </div> 
            <div className="card-body">  
                    {todos != null && todos.map((d, index) =>{
                        const per = d.readChaptersCnt === 0?0:(d.readChaptersCnt/d.chapterCount * 100).toFixed(1);  
                        let colorIdx = index;
                        if (index > 4)
                            colorIdx =  index % 5;   
                    return (
                    <div className="row g-3" key={d.planBookId}>  
                        <div className="col-3">    
                            <a type="button" className="btn p-0 me-2" onClick={() => handleListShow(d)}>{d.nameKo}</a> 
                            <span className="text-danger small ms-2">({d.maxChapterNum}/{d.chapterCount})</span>
                        </div>
                        <div className="col-8">
                            <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                <div className={`progress-bar ${bgColor[colorIdx]}`} style={{width: `${per}%` }}>{per}%</div>                                
                            </div> 
                        </div>  
                        <div className="col-1">
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
                                onClick={() => handleShow(d.planBookId, d.bookId, d.maxChapterNum)}
                            > 
                                <i className="bi bi-pencil-fill" style={{ fontSize: '0.7rem' }}></i>
                            </button> 
                            </div> 
                        </div>
                    </div>  
                    )
                    })} 
            </div>
        </div>
            
    </div>  


    {/* 완료목록 시작*/}
    <div className="col-lg-9">  
        <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3"> 
            <h5 className="my-0 fw-normal">완료목록  - {readCount}회차 </h5>
            </div>
            <div className="card-body"> 
                {finished != null && finished.map((d, index) =>{ 

                    return (

                    <div className="row g-3" key={d.planBookId}>  
                        <div className="col-2"> 
                            <a type="button" className="btn p-0 me-2 "
                            onClick={() => handleListShow(d)}> {d.nameKo} </a> 
                        </div>
                        <div className="col-10">
                            <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar bg-primary-subtle text-primary-emphasis" style={{width: "100%"}}>{d.startDt} ~ {d.endDt}</div>
                            </div> 
                        </div>  
                    </div> 
                    )
                })}
            </div>
        </div> 
    </div>
     {/* 완료목록 끝*/}


     {/* 리스트모달 시작*/}
    <Modal show={showList} onHide={handleListClose} centered backdrop="static" keyboard={false} scrollable>
    <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fs-5 fw-bold">
        {/* 제목 밑줄 적용 */} 
        <span className="title-underline">{selectedTodo.bookName}</span>
        </Modal.Title>
    </Modal.Header>

    <Modal.Body className="p-0">
        <Form>
        {/* 헤더 섹션 */}
        <div className="d-flex px-4 py-2 bg-light border-bottom">
            {[ '장범위', '기간', '등록일'].map((label) => (
            <span 
                key={label}
                className="flex-fill text-uppercase text-muted text-start" 
                style={{ fontSize: "11px", letterSpacing: ".06em", fontWeight: "bold" }}
            >
                {label}
            </span>
            ))}
        </div> 

        {/* 리스트 섹션 */}
        <ListGroup variant="flush"> 
            {todoLogs.map((d, index) => (
            <ListGroup.Item 
                key={index}
                action 
                as="button" 
                type="button" 
                className="d-flex align-items-center border-0 px-4 py-3 custom-hover-item  border-bottom"
            >  
                <span className="flex-fill text-start fw-medium"><input type="checkbox" value={d.planLogId}
                ref={(el) => {deleteLogIdRef.current[index] = el; }}
                ></input> {d.startChapter}장 ~ {d.endChapter}장</span>
                <span className="flex-fill text-start text-secondary small">{d.startDt} ~ {d.endDt}</span> 
                {/* regDt의 T를 제거하여 출력 */}
                <span className="flex-fill text-start text-muted small">
                {d.regDt}
                </span> 
            </ListGroup.Item>
            ))} 
        </ListGroup>
        </Form>
    </Modal.Body>

    <Modal.Footer className="border-top-0">
        <Button variant="secondary" onClick={handleListClose}>
        닫기  
        </Button> 

        {(selectedTodo.status === "PROCEEDING")  &&  
            <>
            <Button variant="primary" onClick={handleListNew}>추가</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}><i className="bi bi-trash me-1"></i> 삭제</Button>
            </>
        }
    </Modal.Footer>
    </Modal> 
</>
}

export default PlanBookTodo;