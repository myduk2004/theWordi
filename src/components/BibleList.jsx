import { useState, useEffect, useReducer } from "react";
const BibleList = ({verses = [], onDelete}) => { 
 console.log(verses);
  const onClickDelete = (id)=>{
    onDelete(id);
  };

  const [data, setData] = useState([
    {
      title : "title1"
    },
    {
      title : "title2"
    },

    {
      title : "title3"
    },
  ]); 


  return (
    <>
    
      <div className="shadow p-3 mb-5 bg-body-tertiary rounded"> 
        {verses?.map((verse)=>{
          //return (<p key={verse.verseId}>{verse.chapter}:{verse.verse} {verse.text}<i class="bi bi-trash text-danger"></i></p>)
          return (<div key={verse.verseId} className="d-flex justify-content-between align-items-center py-2">
            <span>{verse.chapter}:{verse.verse} {verse.text}</span> 
            <span
              className="text-danger ms-3 p-1"
              role="button"
              onClick={() => onClickDelete(verse.verseId)}
              onMouseOver={(e) => (e.target.style.opacity = 0.7)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
              style={{ fontSize: "10px", cursor: "pointer" }}
            >del</span>
            </div>)
       })}  
      </div> 
    </>
  );
};

export default BibleList;
