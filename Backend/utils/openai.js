const getOpenAIAPIResponse = async(messages) => {
    // Handle both single message (string) and conversation history (array)
    let messageArray;
    if (typeof messages === 'string') {
        messageArray = [{ role: "user", content: messages }];
    } else if (Array.isArray(messages)) {
        messageArray = messages;
    } else {
        messageArray = [{ role: "user", content: String(messages) }];
    }

    // Use Ollama (local AI)
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2";
    
    try {
        console.log("🚀 Sending request to Ollama (local AI)...");
        
        const response = await fetch(`${ollamaUrl}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: ollamaModel,
                messages: messageArray,
                stream: false
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.message && data.message.content) {
            console.log("✅ Successfully received AI response from Ollama");
            return data.message.content;
        }
        
        throw new Error("Invalid response from Ollama");
        
    } catch (err) {
        console.error("❌ Ollama Error:", err.message);
        return `⚠️ **Ollama Connection Error**\n\nCould not connect to Ollama. Please make sure:\n\n1. Ollama is installed: https://ollama.com\n2. Run: \`ollama run llama3.2\`\n3. Ollama server is running on http://localhost:11434\n\nError: ${err.message}`;
    }
}

export default getOpenAIAPIResponse;