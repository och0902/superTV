const express = require('express');
const router = express.Router();

const ctrlAdmin = require('../controllers/ctrlAdmin.js');
const authenticate = require('../middleware/authenticate.js');

// page rounting

router.get('/', ctrlAdmin.output.userLogin);
router.post('/', ctrlAdmin.process.userLogin);

router.get('/userRegister', ctrlAdmin.output.userRegister);
router.post('/userRegister', ctrlAdmin.process.userRegister);

router.get('/adminLogin', ctrlAdmin.output.adminLogin);
router.post('/adminLogin', ctrlAdmin.process.adminLogin);

router.get('/adminRegister', ctrlAdmin.output.adminRegister);
router.post('/adminRegister', ctrlAdmin.process.adminRegister);

module.exports = router;