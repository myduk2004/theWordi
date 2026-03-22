import { useEffect, useState } from "react"; 
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

const EditorView = ({content}) => { 
   
  const [loading, setLoading] = useState(true); 
   

  useEffect(() => {
    if (content)
      
    setLoading(false);

  }, [content]);

  if (loading && !content) return <div className="p-10">로딩 중...</div>;

  return (
    <div>  
      {content && (
        <Viewer initialValue={content} />
      )}
    </div>
  );
};

export default EditorView;