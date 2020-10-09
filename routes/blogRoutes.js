const express = require('express');
const blogController = require('../controllers/blogController')
const {requireAuth} = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/', blogController.blog_index);
router.post('/', blogController.blog_create_post);
router.get('/create', requireAuth, blogController.blog_create_get);
router.get('/:id', blogController.blog_details)
router.delete('/:id', blogController.blog_delete);


module.exports = router;