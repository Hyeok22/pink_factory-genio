import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import ProgressSteps from "../../components/ProgressSteps";
import LoadingScreen from "../../components/loadingScreen";

import checkIcon from "../../assets/check.png";
import checkWhiteIcon from "../../assets/check-white.png";

import "./brandingTone.css";

const BrandingTone = () => {
  const currentStep = 4;

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const [resumeData, setResumeData] = useState(location?.state || {});

  // ✅ 브랜드 톤 선택 상태 관리
  const [selectedTone, setSelectedTone] = useState(null);
  const [brandingTones, setBrandingTones] = useState([]);

  // ✅ Axios를 사용하여 브랜드 톤 리스트 가져오기
  useEffect(() => {
    axios
      .get("/api/v1/tones")
      .then((response) => {
        setBrandingTones(response.data);
      })
      .catch((error) => {
        console.error("[BrandingTone] Error fetching tones:", error);
      });
  }, []);

  // ✅ 브랜드 톤 선택 핸들러
  const handleToneSelect = (tone) => {
    resumeData.tone = tone;
    setSelectedTone(tone);
  };

  // ✅ 다음 페이지 이동
  const onNextClick = async () => {
    try {
      if (!selectedTone) {
        alert("브랜딩 톤을 선택해주세요!");
        return;
      }
      setIsLoading(true);

      delete resumeData.resumeId;
      console.log(resumeData);

      const response = await axios.post("/api/v1/cards", resumeData);
      console.log("[onGenerateKit] Server response:", response.data);

      navigate("/branding-result", { state: response.data });
    } catch(err) {
      setIsLoading(false);
      console.error("[onGenerateKit] 이력서 분석 중 오류 발생:", err);
    }
  };

  return (
    <>
      <div className="branding-tone-body">
        <ProgressSteps currentStep={currentStep} />

        <div className="branding-tone-container">
          <h2 className="branding-title">마지막으로 브랜딩 톤을 선택해주세요.</h2>
          <p className="sub-text">
            원하는 브랜딩 톤을 선택하세요. 제니오가 느낌을 잘 살려볼게요!
          </p>

          <div className="branding-tone-list">
            {brandingTones.map((tone, index) => (
              <button
                key={index}
                className={`branding-tone-item ${selectedTone === tone ? "selected" : ""}`}
                onClick={() => handleToneSelect(tone)}
              >
                <img
                  src={selectedTone === tone.title ? checkWhiteIcon : checkIcon}
                  alt="check"
                  className="check-icon"
                />
                <div className="branding-tone-title">{tone.title}</div>
                <div className="branding-tone-description">{tone.description}</div>
              </button>
            ))}
          </div>

          {/* ✅ 선택한 경우에만 "다음" 버튼 표시 */}
          {selectedTone && (
            <button className="branding-tone-next-btn" onClick={onNextClick}>
              다음
            </button>
          )}
        </div>
      </div>
      {isLoading && (<LoadingScreen currentStep={currentStep} />)}
    </>
  );
};

export default BrandingTone;