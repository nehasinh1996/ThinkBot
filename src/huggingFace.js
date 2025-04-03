const HF_API_KEY = `Bearer ${import.meta.env.VITE_HF_API_KEY}`;
const HF_IMAGE_MODEL = import.meta.env.VITE_HF_IMAGE_MODEL;
const HF_TEXT2IMG_MODEL = import.meta.env.VITE_HF_TEXT2IMG_MODEL;

// 🔹 Function to describe an image
export async function describeImage(file) {
    try {
        const imageBuffer = await file.arrayBuffer(); // Read image as binary

        const response = await fetch(HF_IMAGE_MODEL, {
            method: "POST",
            headers: {
                Authorization: HF_API_KEY,
                "Content-Type": "application/octet-stream",
            },
            body: imageBuffer, // Send binary data
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
        }

        const result = await response.json();
        return result?.generated_text || "I couldn't describe this image.";
    } catch (error) {
        console.error("❌ AI Error:", error);
        return "Error processing image.";
    }
}

// 🔹 Function to generate an image from text
export async function generateImage(prompt) {
    try {
        const response = await fetch(HF_TEXT2IMG_MODEL, {
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

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("❌ Error generating image:", error);
        return null;
    }
}
