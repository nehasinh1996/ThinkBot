const HF_API_URL = import.meta.env.VITE_HF_API_URL;
const HF_API_KEY = `Bearer ${import.meta.env.VITE_HF_API_KEY}`;


// Function to generate an image from a text prompt
export async function generateImage(prompt) {
    try {
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: HF_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate image: ${response.statusText}`);
        }

        const result = await response.blob();
        return URL.createObjectURL(result);  // Convert Blob to image URL
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
}

// Function to describe an uploaded image
export async function describeImage(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD_EquE9QV5y1raSL9YeGPr5a0GXeuXYlQ"
, { // Replace with actual endpoint
            method: "POST",
            headers: {
                Authorization: HF_API_KEY,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to describe image: ${response.statusText}`);
        }

        const result = await response.json();
        return result.description || "No description available";
    } catch (error) {
        console.error("Error describing image:", error);
        return "Failed to analyze image.";
    }
}
