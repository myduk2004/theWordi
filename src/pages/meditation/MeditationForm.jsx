import { useState, useEffect, useRef } from "react";

import '@toast-ui/editor/dist/toastui-editor.css';
// 2. Color Syntax 플러그인 스타일 (이게 빠졌을 확률이 높습니다!)
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'; 
import Editor from '@toast-ui/editor'; 
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'; 
import { MeditationApi } from "../../api/meditationApi";
import BibleSearch  from "../../components/BibleSearch";
 import { todayYMD } from '../../util/common.js';


 import api from "../../api/api"; 
 


const MeditationForm = () => {
    const editorRef = useRef(null); 
    const editorInstance = useRef(null); 
    const [form, setForm] = useState({
        date: todayYMD(), 
        title: "" , 
        text:"",
    });

    useEffect(()=>{

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

        return () => {
            editorInstance.current.destroy();
        };  
    }, []);

    const handleSubmit = () =>{
        const content = editorInstance.current.getHTML(); 
        return false;
    }
  
    const handleChange = (e) => {
        const { name, value }  = e.target;
    }


    const handleInsertVerse = ({bookName, chapter, verse, text}) =>{ 
        if (editorInstance.current)
        {
            const verseText = `${text}(${bookName} ${chapter}:${verse})`;
            editorInstance.current.insertText(verseText);
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
                        <input type="date" className="form-control" name="date" placeholder="날짜" 
                        onChange={handleChange}
                        value={form.date} /> 
                    </div>
                    <div className="col-md-10"> 
                        <input type="text" className="form-control" name="title" placeholder="제목을 입력해주세요"
                       onChange={handleChange}
                        value={form.title} /> 
                    </div>

                    <BibleSearch onSelect={handleInsertVerse}></BibleSearch> 

                    <div className="col-md-12">
                        <div ref={editorRef}></div>
                    </div>  

                    <div className="col-md-12 d-flex justify-content-end align-items-center"> 
                        <button type="button"
                        className="btn btn-primary me-2">조회  </button> 
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