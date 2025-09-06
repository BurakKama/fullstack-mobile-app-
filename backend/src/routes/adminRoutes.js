const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/users', adminController.listUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.updateUserRole);

router.get('/businesses', adminController.listBusinesses);
router.delete('/businesses/:id', adminController.deleteBusiness);
router.put('/businesses/:id', adminController.updateBusiness);

router.get('/products', adminController.listProducts);
router.delete('/products/:id', adminController.deleteProduct);
router.put('/products/:id', adminController.updateProduct);

module.exports = router;
