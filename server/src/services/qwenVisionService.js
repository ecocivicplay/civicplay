import axios from "axios";

export async function verifyCivicAction(imageUrl) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen2.5-vl-72b-instruct",
        max_tokens: 500,
        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: `
You are an AI that verifies civic activity proofs.

Accept ONLY if the image clearly shows:
- A person cleaning garbage
- A person collecting waste
- A person throwing garbage into a dustbin
- Tree planting
- Any genuine public civic improvement activity

Reject if:
- Only garbage is visible
- No person is performing an action
- Random street/environment
- Selfie
- Indoor unrelated photo

Reply ONLY in valid JSON.

Example:

{
  "verified": true,
  "activity": "Cleaning garbage",
  "confidence": 0.96,
  "reason": "Person is collecting trash."
}
`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Verify this civic activity image."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "CivicPlay"
        }
      }
    );

    const content = response.data.choices[0].message.content;

    console.log("AI Response:", content);

    return JSON.parse(content);

  } catch (error) {

    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );

    return {
      verified: false,
      confidence: 0,
      activity: "Unknown",
      reason: "AI verification failed."
    };
  }
}