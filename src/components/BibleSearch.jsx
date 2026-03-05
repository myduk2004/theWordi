import { useState, useEffect, useRef } from "react";
import { BibleApi, TESTAMENTS } from "../api/bibleApi";
import { validate_bible_search } from '../util/validation.js';

const BibleSearch = ({onSelect}) => {   
    const [version, setVersion] = useState([]);
    const [allBook, setAllBook] = useState([]);
    const [book, setBook] = useState([]);
    const [errors, setErrors] = useState([]);
    const [verses, setVerses] = useState([]); 
    const [open, setOpen] = useState(false);
    const closeBtn = useRef(null);
    const [searchForm, setSearchForm] = useState({
        versionId: "",
        testament: "OLDT",
        bookId: 1,
        chapter: 1,
        verse: "" , 
        verseTo:"",
    });

    useEffect(()=>{ 

        //성경검색조건 init 시작 
        const init = async () =>{
            const data = await BibleApi.getVersion(); 
            const defaultVersionId = data.versions[0]?.versionId ??"";  
            const defaultTestament = TESTAMENTS[0].testamentId;
            const filteredBooks = data.books.filter((b) => b.versionId === defaultVersionId 
                                                        && b.testament === defaultTestament); 
            const defaultBookId = filteredBooks?.[0]?.bookId ?? "";

            setVersion(data.versions);
            setAllBook(data.books);  
            setBook(filteredBooks); 
            
            setSearchForm(
                {
                    versionId: defaultVersionId,
                    testament: defaultTestament,
                    bookId: defaultBookId,
                    chapter: "1",
                    verse: "" , 
                    verseTo:"",
                }
            ); 
            
        }

        init();  
        //성경검색조건 끝 
        
    }, []); 

    const handleChange = (e) => {
        const { name, value }  = e.target;
        
        if (name === "versionId")
        {
            const defaultTestament = TESTAMENTS[0].testamentId;
            const filterBook =  allBook.filter((b) => 
                                b.versionId === value 
                                && b.testament === defaultTestament);
            setBook(filterBook);  
            
            setSearchForm({
                ...searchForm,  
                versionId : value, 
                testament : TESTAMENTS[0].testamentId,
                bookId : filterBook?.[0]?.bookId ?? "", 
                chapter : 1
            });
        } 
        else if (name === "testament")
        {
            const filterBook =  allBook.filter((b) => 
                                b.versionId === searchForm.versionId 
                                && b.testament === value);
            setBook(filterBook); 

            setSearchForm({
                ...searchForm,   
                testament : value,
                bookId : filterBook?.[0]?.bookId ?? "",  
                chapter : 1
            });
        }  
        else if (name === "bookId")
        {
            setSearchForm({
                ...searchForm,    
                bookId : value,
                chapter : 1
            });
        } 
        else 
        {
            setSearchForm({
                ...searchForm,    
                [name] : value 
            });
        }
    }   
 

   //성경구절 리스트 조회
    const loadData = async () => { 
    try
    {
        const data = await BibleApi.getVerses(
            [searchForm.versionId],
            searchForm.bookId,
            searchForm.chapter, 
            searchForm.verse, 
            searchForm.verseTo 
        ); 
        
        setVerses(data?.[0]?.verses ?? []); 
 
    }
    catch(e){
        alert("목록 조회 중 오류가 발생했습니다.");
    }
    }; 


    const onClickSearch = async (e) => {
        e.preventDefault(); 

        if (!open){ 
            setOpen(true);
            closeBtn.current?.click();
        };
        
        const validate_err =  validate_bible_search(searchForm); 
        if (validate_err.length > 0)
        {
            return;
        }
        
        await loadData();
    }; 

    const onVerseClick = (bookName, chapter, verse, text) =>{ 
        onSelect({bookName, chapter, verse, text});
    } 
    return (
    <> 
        <div className="col-md-3"> 
            <select name="versionId"  
            className="form-select"
            onChange={handleChange}
            value={searchForm.versionId || ""}
            >
                {version.map((d) => (
                <option key={d.versionId} value={d.versionId}>
                {d.versionName}
                </option>
                ))}
            </select> 
        </div>
        <div className="col-md-2">  
            <select
            name="testament"
            value={searchForm.testament || ""}
            className="form-select"
            onChange={handleChange}
            >
                {TESTAMENTS.map((d) => (
                <option key={d.testamentId} value={d.testamentId}>
                    {d.testamentNm}
                </option>
                ))}
            </select>
        </div>
        <div className="col-md-2">  
            <select name="bookId"  
            className="form-select"
            onChange={handleChange}
            value={searchForm.bookId || ""}
            >
                {book.map((d) => (
                <option key={d.bookId} value={d.bookId}>
                {d.nameKo}
                </option>
                ))}
            </select> 
        </div>
        <div className="col-md-1"> 
            <input type="text" 
                inputMode="numeric" 
                className="form-control" 
                name="chapter" 
                placeholder="장" 
                onChange={handleChange}
                value={searchForm.chapter}
            />
        </div> 
        <div className="col-md-1"> 
            <input type="text" 
            inputMode="numeric" 
            className="form-control"
            name="verse"
            placeholder="절" 
            onChange={handleChange}
            value={searchForm.verse}
            />
        </div>

        <div className="col-md-1"> 
            <input type="text" 
            inputMode="numeric" 
            className="form-control"
            name="verseTo"
            placeholder="절" 
            onChange={handleChange}
            value={searchForm.verseTo}
            />
        </div>

        <div className="col-md-2">   
            <button type="button"
            className="btn btn-warning btn-sm"
            style={{ 
                    backgroundColor: '#FFCC00', 
                    borderColor: '#E6B800',
                    color: '#333',
                    fontWeight: '600'
                }} 
            onClick={onClickSearch}>💡search</button> 
 

            <button type="button" className="btn btn-warning btn-sm"  
            style={{ 
                    backgroundColor: '#FFCC00', 
                    borderColor: '#E6B800',
                    color: '#333',
                    fontWeight: '600'
                }}
            data-bs-toggle="collapse" data-bs-target="#collapseExample" 
            aria-expanded="false" aria-controls="collapseExample"  
            ref={closeBtn} 
            onClick={() =>{setOpen(!open)}} 
            >^</button>
        </div>
        

        <div className="col-md-12 collapse" id="collapseExample">   
            <div className="card card-body">  
                {verses?.map((verse)=>{ 
                    return (
                        <div key={verse.verseId}  
                            className="d-flex justify-content-between align-items-center py-2">
                            <span
                                style={{ cursor: "pointer" }}
                                onClick={() => onVerseClick(verse.bookName, verse.chapter, verse.verse, verse.text )}
                            >{verse.chapter}:{verse.verse} {verse.text}</span> 
                            <span
                                className="text-danger ms-3 p-1"
                                role="button"                       
                                onMouseOver={(e) => (e.target.style.opacity = 0.7)}
                                onMouseOut={(e) => (e.target.style.opacity = 1)}
                                style={{ fontSize: "10px", cursor: "pointer" }}
                                onClick={() => onVerseClick(verse.bookName, verse.chapter, verse.verse, verse.text )}
                                >add</span>
                        </div>)
                })}   
            </div>
        </div> 
    </>
    );
};

export default BibleSearch;
