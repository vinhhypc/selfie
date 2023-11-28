"use client";
import { Button, message } from "antd";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import uploadApi from "../api/uploadApi";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";
const videoConstraints = {
  facingMode: FACING_MODE_USER,
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  const handleClick = useCallback(() => {
    setImgSrc("");
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const handleSend = async () => {
    if (!imgSrc) {
      message.error("Vui lòng chụp ảnh trước");
      return;
    }
    try {
      await uploadApi.uploadImg(imgSrc);
      message.success("Upload thành công");
    } catch (e) {
      message.error("Upload thất bại");
    }
  };

  return (
    <div className="h-screen bg-[#f5f8ff]">
      {!imgSrc && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={{
            ...videoConstraints,
            facingMode,
          }}
          style={{
            width: "90%",
            height: "70%",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "30px",
            marginTop: "20px",
            marginLeft: "20px",
          }}
          className="webcam"
        />
      )}
      {imgSrc && (
        <Image
          alt="img"
          src={imgSrc}
          style={{
            width: "90%",
            height: "70%",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "30px",
            marginTop: "20px",
            marginLeft: "20px",
          }}
        />
      )}
      <div className="flex justify-center mt-2">
        <Button href="/multiPhoto">Chuyển sang chế độ multi</Button>
      </div>
      {imgSrc ? (
        <div className="flex justify-center mt-2">
          <Button
            type="primary"
            className="flex items-center"
            onClick={() => setImgSrc("")}
          >
            Chụp lại
          </Button>
          <Button onClick={handleClick} className="ml-1">
            Switch Camera
          </Button>
        </div>
      ) : (
        <div className="flex justify-center mt-2">
          <Button onClick={capture} type="primary">
            Chụp ảnh
          </Button>
          <Button onClick={handleClick} className="ml-1">
            Switch Camera
          </Button>
        </div>
      )}
      <div className="flex justify-center mt-2">
        <Button onClick={handleSend}>Gửi</Button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(WebcamCapture), { ssr: false });
