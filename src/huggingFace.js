export async function query() {
	const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_TOKEN; // For Vite (React with Vite)
	// Use process.env.REACT_APP_HUGGING_FACE_API_TOKEN for create-react-app

	const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
		{
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({ inputs: prevUser.prompt }),
		}
	);
	const result = await response.blob();
	return result;
}

