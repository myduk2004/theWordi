import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { BibleApi } from "../api/bibleApi";


const initBookId = 1;           //bookID 초기값은 1(창세기)로 설정
const initTestament = "OLDT";   //testament 초기값은 '구약'으로 설정

//없으면 bookId = null로 있으면 bookID는 있는값으로 
const BibleBookSelect = ({ versionId, bookId, onChange }) => { 

const [books, setBooks] = useState([]); 
const [testament, setTestament] = useState(initTestament);
const [selectedBookId, setSelectedBookId] = useState(bookId);

useEffect(()=>{

    const loadBooks = async () =>{   
        
        try 
        {

            const data =  await BibleApi.getBooks(versionId);
            setBooks(data);   
            
            //등록된 Book이 있을 경우  
            if (bookId)
            { 
                const currentBook = data.find(b => b.bookId === Number(bookId));    
                if (currentBook) { 
                    setTestament(currentBook.testament);    
                }  
                else
                {
                    setTestament(initTestament);       
                } 
            }  
            else 
            {
                setTestament(initTestament);   
            }
             
        }
        catch(err)
        {
            alert("성경책 조회 중 오류가 발생하였습니다. : "+err);
        } 
    };
    
    if (versionId)
    {
        loadBooks();    
    } 

}, [versionId]);
 



//useMemo는 rendering이 진행되는 도중에 계산함 
//순수하게 계산만 하는 로직 넣도록
const filteredBooks = useMemo(() => {      
       return books.filter(book => book.testament === testament); 
}, [books, testament]);
 


// testament가 변경 시에만 실행
// [참고] : filteredBook 사용하므로 filteredBook 밑에 선언
// selectedBookId 설정
useEffect(() =>{
     
    if (bookId)  
    { 
        handleSelected(bookId, null); 
    }
    else 
    {
        //case2:  bookId가 없는경우 testament 변경 시 첫번째 값으로 선택
        const [firstBook = null] = filteredBooks; 
 
        //선택된 책 초기값 셋팅
        if (firstBook != null)
        { 
            handleSelected(firstBook.bookId, null); 
        } 
        else 
        {
            handleSelected(null, null); 
        }
    } 

}, [filteredBooks]);


const handleTestament = (e) =>{ 
    setTestament(e.target.value);
}

const handleBookChange = (e) => { 
    handleSelected(e.target.value, e);
};


//Book 선택 시 값 설정 및 부모창 이벤트호출
const handleSelected = (val, e) =>{ 
    setSelectedBookId(val);  
    if (e != null)
    {
        onChange(e); 
    }
    else 
    {
        onChange({
            target : {
                name : "bookId",
                value : val
            }
        }); 
    } 
}
return (
    <>
    <Form.Group className="mb-3">
        <Form.Label className="d-block">신/구약</Form.Label>
        <div className="d-flex align-items-center border rounded px-3 bg-light" style={{ height: '38px' }}>
            <Form.Check
                inline 
                type="radio"
                label="구약"
                name="testament"
                id="testament-old"
                value="OLDT"
                checked={testament === "OLDT"}
                onChange={handleTestament} 
                className="mb-0"
                style={bookId > 0?{ pointerEvents: 'none', backgroundColor: '#f8f9fa' } : null}
            />
            <Form.Check
                inline 
                type="radio"
                label="신약"
                name="testament"
                id="testament-new"
                value="NEWT"
                checked={testament === "NEWT"}
                onChange={handleTestament} 
                className="mb-0"
                style={bookId > 0?{ pointerEvents: 'none', backgroundColor: '#f8f9fa' } : null}
            />
        </div>
    </Form.Group>

    <Form.Group className="mb-3">
        <Form.Label>성경책</Form.Label>
        <Form.Select 
            name="bookId"  
            value={selectedBookId}
            onChange={handleBookChange}  
            style={bookId > 0?{ pointerEvents: 'none', backgroundColor: '#f8f9fa' } : null}
        >
            {filteredBooks.map(book =>(
            <option key={book.bookId} value={book.bookId}>{book.nameKo}</option>
            ))}           
        </Form.Select>
    </Form.Group>
</>
)}

export default BibleBookSelect;