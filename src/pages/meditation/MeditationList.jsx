import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react"; 
import { MeditationApi } from "../../api/meditationApi";

const MeditationList = () =>{

const navigate = useNavigate();
const [list, setList] = useState([]);
const [page, setPage] = useState(0); 
const observerRef = useRef(null);
const [hasNext, setHasNext] = useState(true);
const hasNextRef = useRef(true);
const [loading, setLoading] = useState(false);
const loadingRef = useRef(false);
const [searchOption, setSearchOption] = useState({
    searchItem : "title",
    keyword : "", 
    startDate : "", 
    endDate : "" 
});

useEffect(()=>{
    const observer = new IntersectionObserver((entries)=>{
       if (entries[0].isIntersecting && hasNextRef.current && !loadingRef.current) {
            setPage(prev => prev + 1);
        }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
},[]);

useEffect(() => {   
    loadData(page);
}, [page]);

const loadData = async (curPage, reset = false) =>{
    
    if (loadingRef.current) return;
    if (!reset && !hasNextRef.current) return;
 
    loadingRef.current = true;
    setLoading(true); 
   
    try 
    {   
        const data = await MeditationApi.getList({...searchOption,  page : curPage, size : 6 }); 
        const newContent = data?.content??[]; 

        setList(prev => (curPage === 0? newContent : [...prev, ...newContent]));  
 
        
        hasNextRef.current = !(data?.last ?? true);
        setHasNext(hasNextRef.current);

        console.log(searchOption);
        console.log(data);
    }
    catch(err)
    {
        console.error("err :", err);
    } 
    finally {
        loadingRef.current = false;
        setLoading(false);
    }
}

const onClickMove = (id) =>{ 
 
    if (id > 0)
    {
        navigate(`/meditations/${id}`);
    }
    else 
    {
        navigate(`/meditations/new`);
    }

}

const onChange = (e) => {
    
    const {name, value} = e.target;
    setSearchOption({
        ...searchOption, 
        [name]: value
    }); 
}

const onClickSearch = () =>{   
    //0으로 초기화 및 데이터 Load
    setList([]);    
    hasNextRef.current = true; 
    setHasNext(true);
    setPage(0);
    loadData(0, true); 
}
return ( 
    <div className="container px-4 mt-5 mb-5">
        <div className="row gx-4 justify-content-center">
            <div className="col-lg-9"> 
                <div className="row mb-2">
                    <div className="col"><h4><i className="bi bi-lightbulb text-warning fs-3"></i> 묵상 </h4>   </div> 
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
                                        defaultValue="title"
                                        onChange={onChange}
                                        >  
                                            <option value="title">제목</option>
                                            <option value="content">본문</option> 
                                        </select> 
                                    </div>
                                    <div className="col-md-4"> 
                                        <input type="text"  className="form-control"  
                                        name="keyword" 
                                        onKeyDown={(e) =>{ if (e.key === "Enter") onClickSearch();}}
                                        onChange={onChange}
                                        />  
                                    </div>
                                    <div className="col-md-2"> 
                                        <input type="date" 
                                        className="form-control"
                                        name="startDate"
                                        onChange={onChange}
                                        /> 
                                    </div>

                                    <div className="col-md-2"> 
                                        <input type="date" className="form-control"
                                        name="endDate"
                                        onChange={onChange}/> 
                                    </div>

                                    <div className="col-md-2"> 
                                        <button type="button" className="btn p-0 me-2 text-primary" onClick={onClickSearch}>  
                                            <i className="bi bi-search fs-5"></i> 
                                        </button>
                                        <button type="button" className="btn p-0 me-2 text-primary"  onClick={() => onClickMove(0)}>
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
                {
                   list?.length < 1 && 
                   <div className="row row-cols-1 row-cols-md-1 mb-3">
                        <div className="col">
                            <div className="card mb-4 rounded-3 shadow-sm">
                                <div className="card-body py-3 bg-primary-subtle text-primary-emphasis">
                                    <h6 className="my-0 fw-normal"><i class="bi bi-exclamation-circle"></i> 조회된 데이터가 없습니다.</h6>
                                </div> 
                            </div>
                        </div>
                    </div>
                     
                }
                    

                <div className="row row-cols-1 row-cols-md-3 mb-3">
                    {
                        list.map((d, idx) =>{ 
                    
                            return (  
                            <div className="col d-flex" key={d.meditationId}>
                                <div className="card mb-4 rounded-3 shadow-sm  w-100 d-flex flex-column">
                                    <div className="card-header py-3 text-center">
                                        <h5 className="my-0 fw-normal">{d.title}</h5>
                                    </div>
                                    <div className="card-body  d-flex flex-column"> 
                                        <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                                            <li>{d.text}...</li>  
                                        </ul> 
                                
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
                            ) 
                        })
                    }
 
                </div> 

                <div ref={observerRef} />
                {loading && <div className="text-center my-3"><div className="spinner-border m-5" role="status">
                <span className="visually-hidden">Loading...</span>
                </div></div>}
                {!hasNext && list.length > 0 && <div className="text-center my-3"><p> <mark>마지막 페이지입니다.</mark> </p></div>}       

            </div>




        </div>
    </div> 
);
    
}

export default MeditationList