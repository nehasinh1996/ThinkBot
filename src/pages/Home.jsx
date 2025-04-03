import { useContext, useState } from "react";
import "../App.css";
import { RiImageAddLine } from "react-icons/ri";
import { FaMagic } from "react-icons/fa";
import { FaArrowUpLong } from "react-icons/fa6";
import { dataContext, prevUser } from "../context/UserContext";
import { generateResponse } from "../gemini";
import { describeImage, generateImage } from "../huggingFace";


function Home() {
  const {
    setStartRes,
    input,
    setInput,
    setFeature,
    setShowResult,
    setGenImgUrl,
    uploadedImg,
    setUploadedImg
  } = useContext(dataContext);

  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    setStartRes(true);
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    prevUser.prompt = input;
    setInput("");
  
    // ✅ Process uploaded image first
    if (uploadedImg) {
      try {
        const fileInput = document.getElementById("inputImg").files[0];
  
        if (fileInput) {
          const result = await describeImage(fileInput); // ✅ FIXED
  
          if (typeof result === "string") {
            setMessages((prev) => [...prev, { sender: "ai", text: result }]);
          } else {
            console.error("❌ Unexpected response format:", result);
          }
  
          setUploadedImg(null); // ✅ Reset uploaded image
          return;
        }
      } catch (error) {
        console.error("❌ Error analyzing image:", error);
      }
    }
  
    // ✅ If no image, process text input
    try {
      const result = await generateResponse(input); // ✅ Pass input to AI
      setShowResult(result);
      setMessages((prev) => [...prev, { sender: "ai", text: result }]);
      setFeature("chat");
    } catch (error) {
      console.error("❌ Error fetching chat response:", error);
    }
  };
  

  const handleImage = async (e) => {
    setFeature("upimg");
    const file = e.target.files[0];
  
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      alert("❌ Please upload a valid image file.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target.result;
      setUploadedImg(imageUrl);
      prevUser.imgUrl = imageUrl;
  
      // ✅ Show uploaded image in chat
      setMessages((prev) => [...prev, { sender: "user", img: imageUrl, text: "What is this?" }]);
  
      try {
        const result = await describeImage(file); // ✅ FIXED
  
        if (typeof result === "string") {
          setMessages((prev) => [...prev, { sender: "ai", text: result }]);
        } else {
          console.error("❌ Unexpected response format:", result);
        }
      } catch (error) {
        console.error("❌ Error analyzing image:", error);
      }
    };
  
    reader.readAsDataURL(file);
  };
  

  const handleGenerateImg = async () => {
    if (!input.trim()) return;
    setStartRes(true);
    setGenImgUrl("");
    prevUser.prompt = input;
  
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
  
    try {
      const result = await generateImage(input); // ✅ FIXED
  
      if (typeof result === "string") {
        setMessages((prev) => [...prev, { sender: "ai", img: result }]);
        setFeature("genimg");
      } else {
        console.error("⚠️ Invalid response format for image generation.");
      }
    } catch (error) {
      console.error("❌ Error generating image:", error);
    }
  };
  

  return (
    <div className="home">
      <nav>
        <div className="logo" onClick={() => window.location.reload()}>
          <img src="/logo.png" alt="Think Bot" className="logo-img" />
        </div>
      </nav>

      <input type="file" accept="image/*" hidden id="inputImg" onChange={handleImage} />

      <div className="chat-page">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-chat" : "ai-chat"}>
            {msg.img && <img src={msg.img} alt="Uploaded" className="uploaded-image" />}
            {msg.text && <p>{msg.text}</p>}
          </div>
        ))}
      </div>

      <form className="input-box" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <div className="input-container">
            <input
              type="text"
              placeholder="Type your prompt..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {input.trim() && (
              <button type="submit" className="arrow-btn">
                <FaArrowUpLong />
              </button>
            )}
          </div>

          <div className="btn-container">
            <button type="button" onClick={handleGenerateImg} className="generate-btn">
              <FaMagic size={22} />
            </button>
            <button type="button" onClick={() => document.getElementById("inputImg").click()} className="upload-btn">
              <RiImageAddLine size={22} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Home;
