// public/js/script.js
// (Mantén todo tu código JavaScript anterior aquí)

// ... (todo el código de tu script.js hasta la función sendMessage) ...

async function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    appendMessage(messageText, 'user');
    chatInput.value = '';

    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('chat-message', 'ai', 'typing-indicator');
    typingIndicator.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // ¡CAMBIO AQUÍ! Apuntamos a la nueva ruta /api/chat
        const response = await fetch('/api/chat', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        chatMessages.removeChild(typingIndicator);
        appendMessage(data.reply, 'ai');
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error('Error al enviar mensaje al backend:', error);
        if(chatMessages.contains(typingIndicator)) {
            chatMessages.removeChild(typingIndicator);
        }
        appendMessage("Lo siento, no pude obtener una respuesta de la IA. Intenta de nuevo más tarde.", 'ai');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ... (el resto de tus funciones y código JavaScript) ...