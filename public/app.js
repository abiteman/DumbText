document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const themeToggle = document.getElementById('themeToggle');
    const formatButtons = document.querySelectorAll('.options-section button');

    // Theme toggle
    const theme = localStorage.getItem('theme') || 'light';
    document.body.className = `${theme}-mode`;

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        document.body.className = `${newTheme}-mode`;
        localStorage.setItem('theme', newTheme);
    });

    // Format buttons
    formatButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const type = button.dataset.type;
            const text = inputText.value;

            if (!text.trim()) {
                alert('Please enter some text to format');
                return;
            }

            try {
                const response = await fetch('/api/format', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text, type })
                });

                const data = await response.json();
                outputText.value = data.result;
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while formatting the text');
            }
        });
    });

    // Copy button
    copyButton.addEventListener('click', async () => {
        const text = outputText.value;
        if (!text.trim()) {
            alert('No formatted text to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to copy text to clipboard');
        }
    });

    // Download button
    downloadButton.addEventListener('click', () => {
        const text = outputText.value;
        if (!text.trim()) {
            alert('No formatted text to download');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted-text.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}); 