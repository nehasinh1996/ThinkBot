import { createContext, useState } from "react";

export const dataContext = createContext();

export let user = {
  data: null,
  mime_type: null,
  imgUrl: null,
};

export let prevUser = {
  data: null,
  mime_type: null,
  prompt: null,
  imgUrl: null,
};

function UserContext({ children }) {
  let [startRes, setStartRes] = useState(false);
  let [popUp, setPopUP] = useState(false);
  let [input, setInput] = useState("");
  let [feature, setFeature] = useState("chat");
  let [showResult, setShowResult] = useState("");
  let [prevFeature, setPrevFeature] = useState("chat");
  let [genImgUrl, setGenImgUrl] = useState("");
  let [uploadedImg, setUploadedImg] = useState(null); // ✅ Store uploaded image

  // ✅ Function to handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      const imgUrl = URL.createObjectURL(file); // Create temporary URL
      setUploadedImg(imgUrl); // Store image URL
    }
  };

  let value = {
    startRes,
    setStartRes,
    popUp,
    setPopUP,
    input,
    setInput,
    feature,
    setFeature,
    showResult,
    setShowResult,
    prevFeature,
    setPrevFeature,
    genImgUrl,
    setGenImgUrl,
    uploadedImg, // ✅ Pass uploaded image
    setUploadedImg,
    handleImageUpload, // ✅ Function for handling image uploads
  };

  return (
    <dataContext.Provider value={value}>{children}</dataContext.Provider>
  );
}

export default UserContext;
