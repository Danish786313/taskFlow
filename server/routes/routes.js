const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');
const { optionalAuthenticateToken, authenticateToken } = require('../middleware/authMiddleware');

// ==========================================
// Authentication & User Routes
// ==========================================
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.get('/users', optionalAuthenticateToken, authController.getUsers);

router.post('/tasks', optionalAuthenticateToken, taskController.createTask);
router.get('/tasks', optionalAuthenticateToken, taskController.myTaskList);
router.get('/my-tasks', optionalAuthenticateToken, (req, res, next) => {
    req.isMyTasksRoute = true;
        next();
    },
    taskController.myTaskList
);

router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', optionalAuthenticateToken, taskController.updateTask);
router.delete('/tasks/:id', optionalAuthenticateToken, taskController.deleteTask);

module.exports = router;
