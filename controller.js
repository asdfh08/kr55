const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'words.json');

// Чтение слов из файла
function readWords() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Запись слов в файл
function saveWords(words) {
  fs.writeFileSync(filePath, JSON.stringify(words, null, 2));
}

// Получить все слова
function getAllWords(req, res) {
  const words = readWords();
  res.json(words);
}

// Получить случайное слово
function getRandomWord(req, res) {
  const words = readWords();
  if (words.length === 0) {
    return res.status(404).json({ error: 'Слова не найдены' });
  }
  
  const randomIndex = Math.floor(Math.random() * words.length);
  res.json(words[randomIndex]);
}

// Добавить новое слово
function addWord(req, res) {
  const { word, translation } = req.body;
  
  if (!word || !translation) {
    return res.status(400).json({ error: 'Нужно слово и перевод' });
  }
  
  const words = readWords();
  const newWord = {
    id: Date.now(),
    word,
    translation,
    learned: false
  };
  
  words.push(newWord);
  saveWords(words);
  
  res.status(201).json(newWord);
}

// Удалить слово
function deleteWord(req, res) {
  const id = parseInt(req.params.id);
  let words = readWords();
  
  const initialLength = words.length;
  words = words.filter(w => w.id !== id);
  
  if (words.length === initialLength) {
    return res.status(404).json({ error: 'Слово не найдено' });
  }
  
  saveWords(words);
  res.json({ message: 'Слово удалено' });
}

// Отметить как изученное
function markAsLearned(req, res) {
  const id = parseInt(req.params.id);
  const words = readWords();
  
  const word = words.find(w => w.id === id);
  if (!word) {
    return res.status(404).json({ error: 'Слово не найдено' });
  }
  
  word.learned = !word.learned;
  saveWords(words);
  
  res.json(word);
}

module.exports = {
  getAllWords,
  getRandomWord,
  addWord,
  deleteWord,
  markAsLearned
};