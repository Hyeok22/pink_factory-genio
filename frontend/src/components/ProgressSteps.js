import React from "react";
import checkWhiteIcon from "../assets/check-white.png"; 
import "./progressSteps.css";

const ProgressSteps = ({ currentStep }) => {
  const steps = ["프로필 작성", "프로필 확인", "강점 선택", "브랜딩 선택", "키트 생성"];

  return (
    <div className="progress-container">
      <div className="step-wrapper">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index < currentStep ? "completed" : ""} ${index === currentStep ? "current" : ""}`}
          >
            {/* ✅ 이미 지난 단계는 체크 아이콘 표시, 현재 단계는 숫자 유지 */}
            {index < currentStep ? (
              <img src={checkWhiteIcon} alt="완료" className="step-icon" />
            ) : (
              <span className="step-number">{index + 1}</span>
            )}
            <span className="step-text">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
