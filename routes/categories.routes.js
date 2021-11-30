const express = require('express');
const CategoryController = require('../controllers/category.controller')

const router = express.Router();
const category = CategoryController;


router.get(`/`, category.GetCategories);
router.post('/', category.AddCategory);
router.delete('/:id', category.RemoveCategory);
router.get('/:id', category.GetCategoryByID);
router.put('/:id', category.UpdateCategory);

module.exports = router;