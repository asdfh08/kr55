const express = require('express');
const router = express.Router();
const controller = require('./controller');
const logRequest = require('./middleware');

// Используем middleware для всех маршрутов
router.use(logRequest);

// GET /api/words - все слова
router.get('/', controller.getAllWords);

// GET /api/words/random - случайное слово
router.get('/random', controller.getRandomWord);

// POST /api/words - добавить слово
router.post('/', controller.addWord);

// DELETE /api/words/:id - удалить слово
router.delete('/:id', controller.deleteWord);

// PUT /api/words/:id/learned - изменить статус изучения
router.put('/:id/learned', controller.markAsLearned);

module.exports = router;