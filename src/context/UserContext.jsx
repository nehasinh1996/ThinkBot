import { createContext, useState } from "react";

export const dataContext = createContext();

export const user = {
  data: null,
  mime_type: null,
  imgUrl: null,
};

export const prevUser = {
  data: null,
  mime_type: null,
  prompt: null,
  imgUrl: null,
};

function UserContext({ children }) {
  const [startRes, setStartRes] = useState(false);
  const [popUp, setPopUP] = useState(false);
  const [input, setInput] = useState("");
  const [feature, setFeature] = useState("chat");
  const [showResult, setShowResult] = useState("");
  const [genImgUrl, setGenImgUrl] = useState("");
  const [uploadedImg, setUploadedImg] = useState(null);

  const value = {
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
    genImgUrl,
    setGenImgUrl,
    uploadedImg,
    setUploadedImg,
  };

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}

export default UserContext;
