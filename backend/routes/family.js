const express = require('express');
const router = express.Router();
const { createFamily, updateFamily } = require('../controllers/familycontroller');
const auth = require('../middleware/auth'); // Assume exists
const role = require('../middleware/role'); // Assume exists, e.g., role('parent')

router.post('/', auth, role('parent'), createFamily);
router.put('/:id', auth, role('parent'), updateFamily);

module.exports = router;