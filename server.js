const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Number to words conversion helper functions
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function convertLessThanThousand(n) {
        if (n === 0) return '';
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
    }

    if (num === 0) return 'Zero';
    
    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num % 1000000000) / 1000000);
    const thousand = Math.floor((num % 1000000) / 1000);
    const remainder = num % 1000;
    
    let result = '';
    if (billion) result += convertLessThanThousand(billion) + ' Billion ';
    if (million) result += convertLessThanThousand(million) + ' Million ';
    if (thousand) result += convertLessThanThousand(thousand) + ' Thousand ';
    if (remainder) result += convertLessThanThousand(remainder);
    
    return result.trim();
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Text formatting endpoints
app.post('/api/format', (req, res) => {
    const { text, type } = req.body;
    let result = text;

    switch (type.toLowerCase()) {
        case 'sentence':
            // Split by period and space, trim each sentence, and capitalize first letter
            result = text.split(/(?<=\.)\s+/)
                .map(sentence => {
                    sentence = sentence.trim();
                    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
                })
                .join(' ');
            // Handle the case where there's no space after period or it's the last sentence
            result = result.split('.')
                .map((sentence, index, array) => {
                    sentence = sentence.trim();
                    if (sentence.length === 0) return '.';
                    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase() + 
                           (index < array.length - 1 ? '.' : '');
                })
                .join(' ');
            break;
        case 'lower':
            result = text.toLowerCase();
            break;
        case 'upper':
            result = text.toUpperCase();
            break;
        case 'capitalize':
            result = text.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            break;
        case 'title':
            result = text.split(' ')
                .map(word => {
                    const lower = word.toLowerCase();
                    // Don't capitalize articles, coordinating conjunctions, and prepositions
                    const skip = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in'];
                    return skip.includes(lower) ? lower : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                })
                .join(' ');
            // Always capitalize first and last word in title case
            result = result.charAt(0).toUpperCase() + result.slice(1);
            break;
        case 'numbers':
            // Replace numbers with words
            result = text.replace(/\d+/g, match => {
                const num = parseInt(match);
                if (isNaN(num) || num > 999999999999) return match; // Skip if not a valid number or too large
                return numberToWords(num);
            });
            break;
    }

    res.json({ result });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 