import express from 'express'
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../controllers/Category.controller.js'
import { onlyadmin } from '../middleware/onlyadmin.js'

const router = express.Router()

router.post('/add', addCategory)
router.put('/update/:categoryid', updateCategory)
router.get('/show/:categoryid', showCategory) // Remove 'onlyadmin' if you want public access
router.delete('/delete/:categoryid', deleteCategory)
router.get('/all-category', getAllCategory)

export default router