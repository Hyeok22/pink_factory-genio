import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import fileIcon from "../../assets/file.png";
import successIcon from "../../assets/success.png";
import failIcon from "../../assets/fail.png";

import ProgressSteps from "../../components/ProgressSteps";
import LoadingScreen from "../../components/loadingScreen";

import "./resumeUpload.css";

const ResumeUpload = () => {
  const currentStep = 1;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [progessMessage, setProgessMessage] = useState("");

  const [file, setFile] = useState(null); // 업로드된 파일
  const [error, setError] = useState(""); // 파일 크기 초과 에러 메시지
  const [dragOver, setDragOver] = useState(false); // 드래그 상태

  const onGenerateKit = async () => {
    try {
      if (!file) {
        console.log("[onGenerateKit] No file selected. Showing alert.");
        alert("파일을 선택해주세요.");
        return;
      }
  
      setIsLoading(true);
      console.log("[onGenerateKit] Selected file:", file);

      const formData = new FormData()

      formData.append('file', file)

      const response = await fetch(`/api/v1/resumes/stream`, {
        method: 'POST',
        body: formData
      })
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      const messageQueue = [];
      let isProcessing = false;
      
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      const processMessageQueue = async () => {
        if (isProcessing || messageQueue.length === 0) return;
        
        isProcessing = true;
        
        while (messageQueue.length > 0) {
          const data = messageQueue.shift();
          
          try {

            const response = JSON.parse(data);

            console.log("파싱된 객체:", response);
            
            setProgessMessage(response.message);
            
            if (response.type === 'completed' || response.type === 'failed') {
  
              await delay(1500);

              setIsLoading(false);
              
              if (response.type === 'completed' && response.result) {
                navigate("/profile", { state: response.result });
              }
              
              break;
            }
            
            await delay(1500);
            
          } catch (err) {
            console.error("메시지 처리 중 오류:", err);
            setProgessMessage("알 수 없는 오류가 발생했어요. 다시 시도해주세요.");
            await delay(1500);
            
            setIsLoading(false);
            break;
          }
        }
        
        isProcessing = false;
      };
      
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
  
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; 
        
        for (const line of lines) {
          console.log(line)
          if (line.startsWith('data:')) {
              
            messageQueue.push(line.substring(5));
          }
        }
        if (!isProcessing) {
          processMessageQueue();
        }
      }      
    } catch (err) {
      console.error("[onGenerateKit] 이력서 분석 중 오류 발생:", err);
      setIsLoading(false);
    }
  };

  // 파일 처리
  const handleFile = (uploadedFile) => {
    if (uploadedFile) {
      console.log("[handleFile] Uploaded file detected:", uploadedFile);
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setFile(null);
        setError("10MB 미만의 파일만 가능해요.");
      } else {
        setFile(uploadedFile);
        setError("");
      }
    }
  };

  const handleFileUpload = (event) => {
    console.log("[handleFileUpload] File input changed.");
    const uploadedFile = event.target.files[0];
    handleFile(uploadedFile);
  };

  // 드래그 & 드롭
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const uploadedFile = event.dataTransfer.files[0];
    handleFile(uploadedFile);
  };

  return (
    <>
      <div className="resume-body">
        <div className="resume-container">
          <ProgressSteps currentStep={currentStep} />

          {/* 헤더 */}
          <div className="uploadHeader">
            <div className="text-box">
              <span className="title1">
                이력서를 업로드해주세요.
                <br />
              </span>
              <span className="title2">
                퍼스널 브랜딩 키트를 만들기 위해 프로필 정보가 필요해요.
                <br />
                이력서를 업로드하면 제니오가 자동으로 분석해 입력해드릴게요.
              </span>
            </div>
          </div>

          {/* 파일 업로드 박스 */}
          <div className="upload-container">
            <label
              className={`upload-box ${
                error ? "error" : file ? "success" : ""
              } ${dragOver ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="reupload-input"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.md"
                hidden
              />
              {error ? (
                <>
                  <span className="error-icon">
                    <img
                      src={failIcon}
                      alt="file"
                      className="upload-fail-icon"
                    />
                  </span>
                  <p className="error-text">{error}</p>
                  <button
                    type="button"
                    className="reupload-box"
                    onClick={() =>
                      document.getElementById("reupload-input").click()
                    }
                  >
                    다시 업로드
                  </button>
                </>
              ) : file ? (
                <>
                  <span className="success-icon">
                    <img
                      src={successIcon}
                      alt="file"
                      className="upload-success-icon"
                    />
                  </span>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <button
                    type="button"
                    className="reupload-box"
                    onClick={() =>
                      document.getElementById("reupload-input").click()
                    }
                  >
                    다시 업로드
                  </button>
                </>
              ) : (
                <>
                  <span className="upload-icon">
                    <img
                      src={fileIcon}
                      alt="file"
                      className="upload-file-icon"
                    />
                  </span>
                  <p className="upload-info">
                    여기를 클릭하거나 드래그 앤 드롭으로 파일을 업로드해주세요.
                    <br />
                    10MB 미만의 PDF, .docx, .md만 가능해요.
                  </p>
                </>
              )}
            </label>
          </div>

          {/* 업로드 버튼: 파일이 있으면 "uploaded" 클래스 추가 */}
          <button
            className={`upload-btn ${file ? "uploaded" : ""}`}
            onClick={onGenerateKit}
            disabled={!file}
          >
            다음
          </button>
        </div>
      </div>
      {isLoading && (
        <LoadingScreen currentStep={currentStep} message={progessMessage} />
      )}
    </>
  );
};

export default ResumeUpload;
