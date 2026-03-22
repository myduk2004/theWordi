import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";   
import '@toast-ui/editor/dist/toastui-editor.css'; 
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'; 
import Editor from '@toast-ui/editor'; 
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'; 
import { MeditationApi } from "../../api/meditationApi";
import BibleSearch  from "../../components/BibleSearch";
import { todayYMD } from '../../util/common.js';
import { useNavigate } from "react-router-dom"; 
 import api from "../../api/api";  

const MeditationForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { meditationId } = useParams();  
    const editorRef = useRef(null); 
    const editorInstance = useRef(null); 
    const [form, setForm] = useState({
        meditationDt: todayYMD(), 
        title: ""    
    }); 
    const [content, setContent] = useState(null);
    const [errors, setErrors] = useState({
        meditationDt : false,
        title : false, 
        content : false
    });

    
    useEffect(() => {
       
        editorInstance.current = new Editor({
            el: editorRef.current,
            height: "400px", 
            initialEditType: 'wysiwyg',
            plugins:[colorSyntax],
            previewStyle : "vertical", 
            // hideModeSwitch: true,
            placeholder : "내용을 입력하세요...",
            toolbarItems:[
                ['heading', 'bold', 'italic', 'strike'],
                ['hr'], 
                ['ul', 'ol', 'task'],
                ['table', 'image', 'link'],
                ['code', 'codeblock']
            ], 
            hooks : {
                addImageBlobHook : async (blob, callback) =>{
                    const formData = new FormData(); 
                    formData.append('file', blob);

                    const response = await api.post(`/file/upload`, formData);
                    const data = response.data;
                    callback(data.url, 'image');
                }
            }
        });  
        
        const loadData = async () => {

            try 
            {
                const data = await MeditationApi.getOne(meditationId); 
                setForm({
                    meditationDt: data.meditationDt, 
                    title: data.title
                });
    

                if (editorInstance.current)
                { 
                    editorInstance.current.setMarkdown(data.text);
                    editorInstance.current.focus();
                }
            } catch(err)
            {
                console.error("데이터 로드 실패 : " , err);
            }  
        };

        if (meditationId){
            loadData();
        } 
    
        setLoading(false);

        return () => {
            editorInstance.current.destroy();
        };   
    }, [meditationId]);

    const handleSubmit = async () =>{ 
         
        if (loading) return;   

        const currentContent = editorInstance.current.getMarkdown();  
        const unescaped = currentContent.replace(/\\"/g, '"'); 
        const regex = /<span data-verse-id="(\d+)">[^<]*<\/span>/g;
        const verseIds = [];
        let match;
        while ((match = regex.exec(unescaped)) !== null) { 
            verseIds.push(Number(match[1]));  
        }
    
        setContent(currentContent);   
        const formData = {
            ...form, 
            text : currentContent , 
            ...(meditationId && {meditationId} ), 
            verseIds
        };   

        if (!validate(currentContent))
        {
            return ;
        }

        try 
        { 
            const res = await (meditationId
            ?MeditationApi.update(formData)
            :MeditationApi.create(formData));  
            
            if (res.meditationId)
            {
                navigate(`/meditations/${res.meditationId}`);
            }
            else {
                alert("저장 중 오류가 발생했습니다.");
            }
        }
        catch(err)
        {
            console.error("저장 중 오류 발생", err);
        } 
    
    } 

    const validate = (currentContent) =>{

        const newErrors = {
            meditationDt : !form.meditationDt,
            title : !form.title || form.title.trim() === "",
            content : !currentContent || currentContent.trim() === ""
        };
        
        setErrors(newErrors);

        return !newErrors.meditationDt && !newErrors.title && !newErrors.content;
    }

    const handleChange = (e) => {
        const { name, value }  = e.target;
        setForm({
            ...form, 
            [name] : value
        });
    }


    const handleInsertVerse = ({versionId, versionName, bookId, bookName, verseId, chapter,  verse, text }) =>{ 
        
        if (editorInstance.current)
        {    
            const newSpan = `<span data-verse-id="${verseId}">&#8203;</span>`;
            const verseText =  `${text}${newSpan}(${bookName}${chapter}:${verse})`; 

            const currentHTML = editorInstance.current.getHTML();
            editorInstance.current.setHTML(currentHTML + verseText);
            editorInstance.current.moveCursorToEnd();
            editorInstance.current.focus();  
        }
    } 
 
return (
    <>
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
                        <div className="card-header">킹제임스 표준역 {">"} 창세기</div>
                            <div className="card-body">
                <form className="row g-3">
                    <div className="col-md-2"> 
                        <input type="date" 
                        className={`form-control ${errors.meditationDt ? 'is-invalid' : ''}`}
                        name="meditationDt" placeholder="날짜" 
                        onChange={handleChange}
                        value={form.meditationDt} /> <div className="invalid-feedback">날짜를 선택해주세요.</div>
                    </div>
                    <div className="col-md-10"> 
                        <input type="text"  
                        className={`form-control ${errors.title?'is-invalid':''}`}
                        name="title" placeholder="제목을 입력해주세요"
                        onChange={handleChange}
                        value={form.title} /> 
                        
                    </div>

                    <BibleSearch onSelect={handleInsertVerse}></BibleSearch> 

                    <div className="col-md-12">
                        <div ref={editorRef}
                        className ={errors.content?'border border-danger rounded':''} >
                            {errors.content && <div className="text-danger small mt-1">내용을 입력해주세요.</div>}
                       </div>
                    </div>  

                    <div className="col-md-12 d-flex justify-content-end align-items-center"> 
                        <button type="button"
                        className="btn btn-primary me-2"
                        onClick={()=> navigate(`/meditations`)}>목록  </button> 
                        <button type="button" 
                        onClick={handleSubmit}  
                        className="btn btn-primary">
                        저장
                        </button>
                    </div>
                </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export default MeditationForm;