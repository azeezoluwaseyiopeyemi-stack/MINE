const inputField = document.getElementById('user-input');
const outputStream = document.getElementById('output-stream');

inputField.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && inputField.value.trim() !== "") {
        const input = inputField.value;
        inputField.value = '';

        // Display user command in stark white
        const userLine = document.createElement('p');
        userLine.classList.add('user-command');
        userLine.innerHTML = `<span class="prompt">&gt;</span> ${input}`;
        outputStream.appendChild(userLine);

        try {
            const loadingLine = document.createElement('p');
            loadingLine.textContent = "[SYSTEM] Processing unconstrained request...";
            outputStream.appendChild(loadingLine);
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
            outputStream.removeChild(loadingLine);

            // Display AI response in dark crimson red
            const modelLine = document.createElement('p');
            modelLine.classList.add('ai-response');
            modelLine.textContent = data.response;
            outputStream.appendChild(modelLine);

        } catch (error) {
            const errorLine = document.createElement('p');
            errorLine.style.color = '#ff9900';
            errorLine.textContent = `[ERROR] Connection failed. Check Ollama status on port 11434.`;
            outputStream.appendChild(errorLine);
        }
        
        outputStream.scrollTop = outputStream.scrollHeight;
    }
});
