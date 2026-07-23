import { useEffect, useState } from "react";

const EditorView = ({ content }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (content) setLoading(false);
  }, [content]);

  if (loading && !content)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return <div>{content}</div>;
};

export default EditorView;
