import { useContext, useState } from "react";
import { VerseContext } from  "../pages/bible/BibleSearch"; 

const BibleLists = () => {  
    const verses = useContext(VerseContext);  
  return (
    <>   
    {/* <div className={`row row-cols-1 row-cols-md-${verses?verses.length:1} mb-3`}>     */}
     <div className={`row row-cols-1 row-cols-md-${Math.min(verses?.length ?? 1, 4)} mb-3`}>     
        { verses?.length == 0 &&  
            <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm"> 
                    <div className="card-body">
                        <p className="card-text">- 조회된 데이터가 없습니다.</p>
                    </div>
                </div>
            </div>
        } 
        
        { verses?.map((data, idx) => {
            return ( 
                <div className="col" key={data.bibleVersion.versionId}> 
                    <div className={`card mb-4 rounded-3 shadow-sm ${idx === 0?"border-primary":""}`}> 
                        <div className={`card-header py-3 text-center ${idx === 0?"text-bg-primary border-primary":""}`}>
                            <h4 className="my-0 fw-normal">{data.bibleVersion.versionName}</h4>
                        </div>
                        <div className="card-body" >   
                            {  data.verses?.map((verse) => (
                                    <p key={verse.verseId} className="card-text">
                                        {verse.verse}.{verse.text}
                                    </p> 
                                ))  
                            } 
                            </div> 
                    </div> 
                </div>
            )
        })} 
    </div>  
    </>
  );
};

export default BibleLists;
