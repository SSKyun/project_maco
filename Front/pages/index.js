import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import YouTube from 'react-youtube';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// import Image from 'next/image';

const StyledCarousel = styled(Carousel)`
  height: 200vh;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-attachment: fixed;
  .slide {
    opacity: 0.78;
    transition: opacity 1s ease-in-out;
  }

  .slide.selected {
    opacity: 1;
  }
`;

const SlideImage = styled.img`
  height: 100vh;
  object-fit: cover;
`;

const SectionWrapper = styled.div`
  padding: 40px;
  border-bottom: 1px solid #e5e5e5;
`;

const ScrollSection = styled(SectionWrapper)`
  /* height: 200vh; */
  position: absolute;
  top: 260%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 100px 50px;
  text-align: center;
`;

const Logo = styled.img`
  width: 300px;
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: lightsteelblue;
  border: 5px solid #a5d6a7;
  border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const Subtitle = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #666;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 100%; */
`;

const ContentHeader = styled.div`
  margin-bottom: 40px;
  h2 {
    font-size: 2rem;
    font-weight: bold;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 30px;
  width: 80%;
  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 15px;
  }
  p {
    font-size: 1.2rem;
    line-height: 1.5;
  }
`;

const MiddleSectionWrapper = styled(SectionWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f7;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MiddleSectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MiddleSectionSubtitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MiddleSectionContent = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  text-align: left;
`;

const VideoSection = styled(SectionWrapper)`
  display: flex;
  /* height: 30vh; */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 100px;
  width: 100%;
  background-color: aliceblue;
`;

const VideoTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

const FeatureSection = styled(SectionWrapper)`
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: start;
  margin-top: 100px;
  margin-bottom: 100px;
  border-radius: 2rem;
  box-shadow: 0 0 10px 6px rgba(0, 0, 0.1, 0.1);
  background-color: #eeeeee;
`;

const FeatureTitle = styled.h2`
  width: 100%;
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const FeatureSubtitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  text-align: left;
`;

const FeatureCarousel = styled(Carousel)`
  width: 100%;
  /* height: 100%; */
  margin-top: 20px;
  /* background-color: yellow; */
`;

export default function Home() {
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      // 인증이 만료되었다면
      alert('로그인 시간이 만료되었습니다. 다시 로그인하세요.');
      logout();
    }
  }, []);

  return (
    <div>
      <StyledCarousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={false}
        emulateTouch={false}
        swipeable={true}
        dynamicHeight={true}
        showArrows={false}
        showIndicators={false}
        transitionTime={0}
      >
        <div>
          <SlideImage src="/main-page.jpg" alt="Farm 1" />
        </div>
        <div>
          <SlideImage src="/farm2.jpg" alt="Farm 2" />
        </div>
        <div>
          <SlideImage src="/forest.jpg" alt="Farm 3" />
        </div>
      </StyledCarousel>
      <ScrollSection>
        <Logo src="/maco_logo.jpg" alt="스마트팜 로고" />
        <ContentWrapper>
          <ContentHeader>
            <Title>アグリードは何か？</Title>
          </ContentHeader>
          <ContentSection>
            <Subtitle>「マートファーム管理システム」</Subtitle>
            <p>ビッグデータとAIを使って環境による生長分析し、</p>
            <p>ユーザーが簡単に栽培できるサービスです。</p>
          </ContentSection>
          <ContentSection>
            <h3>품질 향상 및 자원 절약</h3>
            <p>
              또한, 스마트팜 기술을 활용하면 농작물의 품질을 향상시키고 농작물에
              필요한 물, 비료 및 농약의 사용량을 줄일 수 있습니다. 이러한
              혁신적인 방식으로 농업과 환경의 지속 가능성을 높일 수 있습니다.
            </p>
          </ContentSection>
          <MiddleSectionWrapper>
            <MiddleSectionTitle>환경 친화적인 스마트팜</MiddleSectionTitle>
            <MiddleSectionSubtitle>
              친환경적인 농업의 새로운 패러다임
            </MiddleSectionSubtitle>
            <MiddleSectionContent>
              스마트팜은 식물의 성장 환경을 최적화하여 농작물의 품질 향상 및
              자원 절약을 실현할 수 있는 차세대 농업 기술입니다. 이를 통해
              환경에 미치는 부정적 영향을 줄이고, 지속 가능한 농업 발전을
              이루어낼 수 있습니다. 함께 스마트팜으로 더 나은 미래를 만들어가요!
            </MiddleSectionContent>
          </MiddleSectionWrapper>
        </ContentWrapper>
        <VideoSection>
          <VideoTitle>스마트팜 소개 영상</VideoTitle>
          <div style={{ width: '100%' }}>
            <YouTube
              videoId="Ual5agBwDyk"
              opts={{
                width: '100%',
                height: '400vh',
                playerVars: {
                  origin:
                    typeof window !== 'undefined' ? window.location.origin : '',
                },
              }}
            />
          </div>
        </VideoSection>
        <FeatureSection>
          <FeatureTitle>컨트롤러</FeatureTitle>
          <FeatureSubtitle>편리한 기능</FeatureSubtitle>
          <FeatureDescription>
            컨트롤러 기능을 이용하여 스마트팜을 쉽고 편리하게 관리할 수
            있습니다.
          </FeatureDescription>
          <FeatureCarousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={false}
            emulateTouch={false}
            swipeable={true}
            dynamicHeight={true}
            showArrows={false}
            showIndicators={false}
            transitionTime={0}
          >
            <div>
              <img
                src="/controller_photo/list_of_devices.png"
                alt="Controller 1"
              />
            </div>
            <div>
              <img
                src="/controller_photo/manual_control.png"
                alt="Controller 2"
              />
            </div>
            <div>
              <img src="/controller_photo/video.png" alt="Controller 3" />
            </div>
          </FeatureCarousel>
        </FeatureSection>
        <FeatureSection>
          <FeatureTitle>대시보드</FeatureTitle>
          <FeatureSubtitle>한눈에 확인</FeatureSubtitle>
          <FeatureDescription>
            대시보드를 통해 스마트팜의 상태를 한눈에 확인할 수 있습니다.
          </FeatureDescription>
          <FeatureCarousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={false}
            emulateTouch={false}
            swipeable={true}
            dynamicHeight={true}
            showArrows={false}
            showIndicators={false}
            transitionTime={0}
          >
            <div>
              <img
                src="/dashboard_photo/dashboard_view.png"
                alt="dashboard 1"
              />
            </div>
            <div>
              <img
                src="/dashboard_photo/manual_control_view.png"
                alt="dashboard 2"
              />
            </div>
            <div>
              <img
                src="/dashboard_photo/operating_time_view.png"
                alt="dashboard 3"
              />
            </div>
          </FeatureCarousel>
        </FeatureSection>
        <FeatureSection>
          <FeatureTitle>통계</FeatureTitle>
          <FeatureSubtitle>데이터 분석</FeatureSubtitle>
          <FeatureDescription>
            통계 기능을 통해 스마트팜의 성장 데이터를 분석할 수 있습니다.
          </FeatureDescription>
          <FeatureCarousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={false}
            emulateTouch={false}
            swipeable={true}
            dynamicHeight={true}
            showArrows={false}
            showIndicators={false}
            transitionTime={0}
          >
            <div>
              <img
                src="/statistic_photo/temperature_graph.png"
                alt="statistic_photo 1"
              />
            </div>
            <div>
              <img
                src="/statistic_photo/growth_prediction.png"
                alt="statistic_photo 2"
              />
            </div>
            <div>
              <img
                src="/statistic_photo/apple_price_prediction.png"
                alt="statistic_photo 3"
              />
            </div>
          </FeatureCarousel>
        </FeatureSection>
        <FeatureSection>
          <FeatureTitle>QnA</FeatureTitle>
          <FeatureSubtitle>질문과 답변</FeatureSubtitle>
          <FeatureDescription>
            QnA 섹션에서 자주 묻는 질문들을 확인하고, 궁금한 사항을 물어볼 수
            있습니다.
          </FeatureDescription>
          <FeatureCarousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={false}
            emulateTouch={false}
            swipeable={true}
            dynamicHeight={true}
            showArrows={false}
            showIndicators={false}
            transitionTime={0}
          >
            <div>
              <img src="/qna_photo/qna_main.png" alt="qna 1" />
            </div>
            <div>
              <img src="/qna_photo/qna_write.png" alt="qna 2" />
            </div>
            <div>
              <img src="/qna_photo/qna_update.png" alt="qna 3" />
            </div>
          </FeatureCarousel>
        </FeatureSection>
      </ScrollSection>
    </div>
  );
}
