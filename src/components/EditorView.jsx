import { useEffect, useState } from "react";

const EditorView = ({ content }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (content) setLoading(false);
  }, [content]);

  if (loading && !content) return <div className="p-10">로딩 중...</div>;

  return <div>{content}</div>;
};

export default EditorView;
