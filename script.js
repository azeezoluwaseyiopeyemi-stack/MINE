const inputField = document.getElementById('user-input');
const outputStream = document.getElementById('output-stream');

// Load saved memory from browser storage on startup
window.addEventListener('DOMContentLoaded', () => {
    const savedChat = localStorage.getItem('orion_chat_history');
    if (savedChat) {
        outputStream.innerHTML = savedChat;
        outputStream.scrollTop = outputStream.scrollHeight;
    }
});

function saveMemory() {
    localStorage.setItem('orion_chat_history', outputStream.innerHTML);
}

inputField.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && inputField.value.trim() !== "") {
        const input = inputField.value;
        inputField.value = '';

        // --- 1. APPEND USER MESSAGE (Right side, White box) ---
        const userRow = document.createElement('div');
        userRow.classList.add('message-row', 'user-row');
        
        const userBubble = document.createElement('div');
        userBubble.classList.add('chat-bubble', 'user-bubble');
        userBubble.textContent = input;
        
        userRow.appendChild(userBubble);
        outputStream.appendChild(userRow);
        saveMemory();
        outputStream.scrollTop = outputStream.scrollHeight;

        try {
            // Loading indicator row (AI left side)
            const loadingRow = document.createElement('div');
            loadingRow.classList.add('message-row', 'ai-row', 'loading-row');
            loadingRow.innerHTML = `<div class="chat-bubble ai-bubble">[SYSTEM] Processing unconstrained request...</div>`;
            outputStream.appendChild(loadingRow);
            outputStream.scrollTop = outputStream.scrollHeight;

            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3',
                    prompt: input,
                    stream: false
                })
            });

            const data = await response.json();
            outputStream.removeChild(loadingRow);

            // --- 2. APPEND AI RESPONSE (Left side, Dark Crimson box) ---
            const aiRow = document.createElement('div');
            aiRow.classList.add('message-row', 'ai-row');
            
            const aiBubble = document.createElement('div');
            aiBubble.classList.add('chat-bubble', 'ai-bubble');
            aiBubble.textContent = data.response;
            
            aiRow.appendChild(aiBubble);
            outputStream.appendChild(aiRow);
            
            saveMemory(); // Save updated conversation to local memory

        } catch (error) {
            const errorRow = document.createElement('div');
            errorRow.classList.add('message-row', 'ai-row');
            errorRow.innerHTML = `<div class="chat-bubble ai-bubble" style="color: #ff9900; border-color: #ff9900;">[ERROR] Connection failed. Check Ollama status on port 11434.</div>`;
            outputStream.appendChild(errorRow);
        }
        
        outputStream.scrollTop = outputStream.scrollHeight;
    }
});
