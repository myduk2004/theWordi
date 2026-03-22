import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; 
import  EditorView  from "../../components/EditorView";
import { MeditationApi } from "../../api/meditationApi"; 
import { formatDateKr } from '../../util/common.js';

const MeditationDetail = () => { 
    const navigate = useNavigate(); 
    const { meditationId } = useParams();
    const [meditationDt, setMeditationDt] = useState("");
    const [title, setTitle] = useState(""); 
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);   
    useEffect(() => { 
        const loadData = async () => {
            try 
            {
            
                const data = await MeditationApi.getOne(meditationId);  
                setMeditationDt(formatDateKr(data.meditationDt)); 
                setTitle(data.title)
                setContent(data.text); 
            }
            catch(error)
            {
                console.error("데이터로딩 실패", error);
            }
            finally{
                setLoading(false);
            }
        }
        if (meditationId){
            loadData();
        } 
    }, [meditationId]); 

    const handleClick = (e) =>{
        const {name, value} = e.target; 
        if (name === "edit")
        {
            navigate(`/meditations/${meditationId}/edit`);
        }
        else 
        {
            navigate(`/meditations`);
        } 
    } 

    if (loading && !content) { return <div className="p-10">로딩 중...</div>; }

    return (

    <div className="container px-4 mt-5 mb-5">
            <div className="row gx-4 justify-content-center">
                <div className="col-lg-9 mb-2">
                    <h4>
                        {/* <i class="bi bi-pencil-square"></i>  */}
                        {/* <i class="bi bi-pencil"></i> */}
                        {/* <i class="bi bi-zoom-in"></i> */}
                        {/* <i class="bi bi-signpost"></i> */}
                        {/* <i class="bi bi-leaf"></i> */}
                        <i className="bi bi-lightbulb"></i>   묵상</h4> 
                </div>

                <div className="col-lg-9">
                    <div className="card mb-4">
                        <div className="card-header">{meditationDt}- {title} </div>
                        <div className="card-body">
                            <form className="row g-3">  
                                <div className="col-md-12">
                                    <EditorView content={content}></EditorView>
                                </div>  

                                <div className="col-md-12 d-flex justify-content-end align-items-center"> 
                                    <button type="button"
                                    onClick={handleClick}
                                    className="btn btn-primary me-2">목록  </button> 
                                    <button type="button"  
                                    name="edit"
                                    onClick={handleClick}
                                    className="btn btn-primary">
                                    수정
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </div>
    </div>  
    );
};

export default MeditationDetail;