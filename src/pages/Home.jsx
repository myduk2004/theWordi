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
               엠마오로 가는 길에 제자 두명은 예수님이 가까이 오시고 대화하시는데도 
               그분을 알아보지 못하였습니다. 
               그럼에도 예수님께서는 가는 길 내내 성경을 설명해주시고 저녁까지 함께 하여서 빵을 찢어주셨습니다. 
               그때서야 비로소 제자들은 눈이 열려 예수님을 알아보았습니다.
              </p>
 
              <p className="lead2">
              theWord.I는 우리가 
              곁에 계신 주님을 찾을 수 있도록 하나님과 내가 교제하는 곳입니다.
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
                <li>
                  오늘 묵상한 말씀을 기록하여 깊은 의미를 찾을 수 있습니다.
                </li>
                <li>
                  기도제목을 기록할 수 있습니다.
                </li>
                 
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
              <p className="lead">
                . 
                현재 준비중입니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
