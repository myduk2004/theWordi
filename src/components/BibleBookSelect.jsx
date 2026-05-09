import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { BibleApi } from "../api/bibleApi";

const BibleBookSelect = ({ versionId, bookId, onChange }) => { 
const [testament, setTestament] = useState("OLDT");
const [books, setBooks] = useState([]);
const bookIdRef = useRef(null);
const [selectedBookId, setSelectedBookId] = useState(bookId);
useEffect(()=>{

    const loadBooks = async () =>{   
        
        try 
        {
            const data =  await BibleApi.getBooks(versionId);
            setBooks(data);  
  
            if (bookId)
            { 
                const currentBook = data.find(b => b.bookId === Number(bookId));    
                if (currentBook) { 
                    setTestament(currentBook.testament);   
                    setSelectedBookId(bookId);
                }
            }
            else 
            {
                setSelectedBookId(1);
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
 
const filteredBooks = useMemo(() => {  
        return books.filter(book => book.testament === testament);
}, [books, testament]);
 
const handleTestament = (e) =>{ 
    setTestament(e.target.value);
}

const handleBookChange = (e) => {
    const nextBookId = e.target.value;
    setSelectedBookId(nextBookId); 
    onChange(e); 
};
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
            />
        </div>
    </Form.Group>

    <Form.Group className="mb-3">
        <Form.Label>성경책</Form.Label>
        <Form.Select 
            name="bookId"  
            value={selectedBookId || ""}
            onChange={handleBookChange}
        >
            {filteredBooks.map(book =>(
            <option key={book.bookId} value={book.bookId}>{book.nameKo}</option>
            ))}           
        </Form.Select>
    </Form.Group>
</>
)}

export default BibleBookSelect;