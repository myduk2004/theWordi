const Home = () => {
  return (
    <>
      {/* <!-- About section--> */}
      <section id="about">
        <div className="container px-4">
          <div className="row gx-4 justify-content-center">
            <div className="col-lg-8">
              <h2>About this page</h2>
             
              <p className="lead2">
               엠마오로 가는 길에 두명의 제자는 예수님께서 가까이 오셔서 대화에 동참하시는데도 
               그분을 알아보지 못했습니다. 
               그럼에도 예수님께서는 가는 길 내내 성경을 설명해주시고 저녁식사자리까지 동행하셔서 
               그 자리에서 빵을 찢어주셨습니다. 
               
              </p>

              <p className="lead2" style={{ fontWeight: 500, color: '#305CDE' }}>그때서야 비로소 제자들은 눈이 열려 예수님을 알아보았습니다.</p>
 
              <p className="lead2">
              <span>예수님께서 찢어주신 그 빵. 그 빵을 나누기 위해 이곳이 있습니다.</span>    
              <span style={{ display: "block" }}> 
              theWord.I는 우리가 곁에 계신 주님을 찾을 수 있도록 하나님과 내가 교제하는 곳입니다.
              </span>
              </p> 
              
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Services section--> */}
      <section className="bg-light" id="services">
        <div className="container px-4">
          <div className="row gx-4 justify-content-center">
            <div className="col-lg-8">
              <h2>Services we offer</h2>
              <ul>
                <li>성경을 버전별로 검색할 수 있습니다. </li>
                <li>오늘 묵상한 말씀을 기록하고 검색할 수 있습니다.</li>
                
                <li>기도제목을 기록하고 검색할 수 있습니다.</li>
                 
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Contact section--> */}
      <section id="contact">
        <div className="container px-4">
          <div className="row gx-4 justify-content-center">
            <div className="col-lg-8">
              <h2>Contact us</h2>
              <ul>
                <li>현재 각 메뉴별로 준비중에 있습니다. </li>
                <li>이 사이트는 개인사이트로 상업적 용도의 목적이 없습니다.</li>  
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
