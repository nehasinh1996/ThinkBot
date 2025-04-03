import { prevUser } from "./context/UserContext";

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD_EquE9QV5y1raSL9YeGPr5a0GXeuXYlQ";

export async function generateResponse() {
  let requestOptions = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "contents": [{
        "parts": [
          { "text": prevUser.prompt },
          ...(prevUser.data
            ? [{
                "inline_data": {
                  "mime_type": prevUser.mime_type,
                  "data": prevUser.data
                }
              }]
            : [])
        ]
      }]
    })
  };

  try {
    let response = await fetch(Api_Url, requestOptions);
    let data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      console.error("Invalid API Response:", data);
      return "Error: No valid response from API.";
    }

    let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    return apiResponse;
  } catch (error) {
    console.error("Error fetching API response:", error);
    return "Error: Failed to get a response.";
  }
}
