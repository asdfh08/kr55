// Загрузка всех слов
async function loadWords() {
    try {
        const response = await fetch('/api/words');
        const words = await response.json();
        
        const wordsList = document.getElementById('wordsList');
        wordsList.innerHTML = '';
        
        words.forEach(word => {
            const div = document.createElement('div');
            div.className = `word-item ${word.learned ? 'learned' : ''}`;
            div.innerHTML = `
                <div>
                    <strong>${word.word}</strong> - ${word.translation}
                    ${word.learned ? ' (изучено)' : ''}
                </div>
                <div class="actions">
                    <button class="learned-btn" onclick="toggleLearned(${word.id})">
                        ${word.learned ? 'Не изучено' : 'Изучено'}
                    </button>
                    <button class="delete-btn" onclick="deleteWord(${word.id})">Удалить</button>
                </div>
            `;
            wordsList.appendChild(div);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Добавление слова
document.getElementById('addForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const wordInput = document.getElementById('wordInput');
    const translationInput = document.getElementById('translationInput');
    
    try {
        const response = await fetch('/api/words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                word: wordInput.value,
                translation: translationInput.value
            })
        });
        
        if (response.ok) {
            wordInput.value = '';
            translationInput.value = '';
            loadWords();
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

// Получение случайного слова
document.getElementById('randomBtn').addEventListener('click', async function() {
    try {
        const response = await fetch('/api/words/random');
        const word = await response.json();
        
        const randomWordDiv = document.getElementById('randomWord');
        randomWordDiv.innerHTML = `
            <h3>${word.word}</h3>
            <p>Перевод: ${word.translation}</p>
            <p>Статус: ${word.learned ? 'Изучено' : 'Не изучено'}</p>
            <button onclick="toggleLearned(${word.id})" style="margin-top: 10px;">
                ${word.learned ? 'Отметить как не изученное' : 'Отметить как изученное'}
            </button>
        `;
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

// Удаление слова
async function deleteWord(id) {
    if (!confirm('Удалить это слово?')) return;
    
    try {
        await fetch(`/api/words/${id}`, {
            method: 'DELETE'
        });
        loadWords();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Изменение статуса изучения
async function toggleLearned(id) {
    try {
        await fetch(`/api/words/${id}/learned`, {
            method: 'PUT'
        });
        loadWords();
        
        // Обновляем случайное слово, если оно открыто
        const randomWordDiv = document.getElementById('randomWord');
        if (randomWordDiv.textContent.includes(id)) {
            document.getElementById('randomBtn').click();
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Загрузка слов при запуске
loadWords();