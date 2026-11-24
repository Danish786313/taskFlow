const { Task, Sequelize } = require('../models');
const { Op } = Sequelize;
const responseHandler = require('../utils/responsHandler');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

function deriveInitials(name) {
    if (!name || typeof name !== 'string') return 'NA';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
}

async function createTask(req, res) {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            tags
        } = req.body;

        if (!title || !title.trim()) {
            return responseHandler.validationErrorResponseData(res, 'Task title is required', 400);
        }

        const validStatuses = ['todo', 'in_progress', 'review', 'completed'];
        const validPriorities = ['low', 'medium', 'high'];

        const taskStatus = status && validStatuses.includes(status.toLowerCase())
            ? status.toLowerCase()
            : 'todo';

        const taskPriority = priority && validPriorities.includes(priority.toLowerCase())
            ? priority.toLowerCase()
            : 'medium';

        const assignee = assignedTo && assignedTo.trim()
            ? assignedTo.trim()
            : (req.user && req.user.name ? req.user.name : 'Unassigned');

        const assigneeInitials = deriveInitials(assignee);

        let tagsString = '';
        if (Array.isArray(tags)) {
            tagsString = tags.join(', ');
        } else if (typeof tags === 'string') {
            tagsString = tags.trim();
        }

        const newTask = await Task.create({
            title: title.trim(),
            description: description ? description.trim() : '',
            status: taskStatus,
            priority: taskPriority,
            dueDate: dueDate || '',
            assignedTo: assignee,
            assigneeInitials: assigneeInitials,
            tags: tagsString
        });

        return responseHandler.successResponseData(
            res,
            newTask,
            201,
            'Task created successfully'
        );
    } catch (err) {
        console.error('Create task error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Something went wrong while creating the task',
            500
        );
    }
}

async function getTaskById(req, res) {
    try {
        const taskId = req.params.id;
        if (!taskId) {
            return responseHandler.validationErrorResponseData(res, 'Task ID is required', 400);
        }

        const task = await Task.findByPk(taskId);
        if (!task) {
            return responseHandler.errorResponseWithoutData(res, 'Task not found', 404);
        }

        return responseHandler.successResponseData(
            res,
            task,
            200,
            'Task retrieved successfully'
        );
    } catch (err) {
        console.error('Get task error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Something went wrong while fetching the task',
            500
        );
    }
}

async function updateTask(req, res) {
    try {
        const taskId = req.params.id;
        if (!taskId) {
            return responseHandler.validationErrorResponseData(res, 'Task ID is required', 400);
        }

        const task = await Task.findByPk(taskId);
        if (!task) {
            return responseHandler.errorResponseWithoutData(res, 'Task not found', 404);
        }

        const {
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            tags
        } = req.body;

        if (title !== undefined) {
            if (!title.trim()) {
                return responseHandler.validationErrorResponseData(res, 'Task title cannot be empty', 400);
            }
            task.title = title.trim();
        }

        if (description !== undefined) {
            task.description = description.trim();
        }

        if (status !== undefined) {
            const validStatuses = ['todo', 'in_progress', 'review', 'completed'];
            if (!validStatuses.includes(status.toLowerCase())) {
                return responseHandler.validationErrorResponseData(
                    res,
                    `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
                    400
                );
            }
            task.status = status.toLowerCase();
        }

        if (priority !== undefined) {
            const validPriorities = ['low', 'medium', 'high'];
            if (!validPriorities.includes(priority.toLowerCase())) {
                return responseHandler.validationErrorResponseData(
                    res,
                    `Invalid priority. Allowed values: ${validPriorities.join(', ')}`,
                    400
                );
            }
            task.priority = priority.toLowerCase();
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        if (assignedTo !== undefined) {
            task.assignedTo = assignedTo.trim();
            task.assigneeInitials = deriveInitials(assignedTo);
        }

        if (tags !== undefined) {
            task.tags = Array.isArray(tags) ? tags.join(', ') : String(tags).trim();
        }

        await task.save();

        return responseHandler.successResponseData(
            res,
            task,
            200,
            'Task updated successfully'
        );
    } catch (err) {
        console.error('Update task error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Something went wrong while updating the task',
            500
        );
    }
}

async function deleteTask(req, res) {
    try {
        const taskId = req.params.id;
        if (!taskId) {
            return responseHandler.validationErrorResponseData(res, 'Task ID is required', 400);
        }

        const task = await Task.findByPk(taskId);
        if (!task) {
            return responseHandler.errorResponseWithoutData(res, 'Task not found', 404);
        }

        await task.destroy();

        return responseHandler.successResponseWithoutData(
            res,
            'Task deleted successfully',
            200
        );
    } catch (err) {
        console.error('Delete task error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Something went wrong while deleting the task',
            500
        );
    }
}

async function myTaskList(req, res) {
    try {
        const {
            search,
            status,
            priority,
            assignedTo,
            myTasks,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const whereConditions = [];

        const isMyTasksOnly = String(myTasks).toLowerCase() === 'true' || req.isMyTasksRoute === true;
        if (isMyTasksOnly) {
            if (req.user && req.user.name) {
                whereConditions.push({
                    assignedTo: { [Op.like]: `%${req.user.name}%` }
                });
            } else if (assignedTo) {
                whereConditions.push({
                    assignedTo: { [Op.like]: `%${assignedTo.trim()}%` }
                });
            } else {
                return responseHandler.errorResponseWithoutData(
                    res,
                    'Please sign in or provide assignedTo parameter to view your tasks',
                    401
                );
            }
        } else if (assignedTo && assignedTo.trim()) {
            whereConditions.push({
                assignedTo: { [Op.like]: `%${assignedTo.trim()}%` }
            });
        }

        if (status && status !== 'all') {
            whereConditions.push({ status: status.toLowerCase() });
        }

        if (priority && priority !== 'all') {
            whereConditions.push({ priority: priority.toLowerCase() });
        }

        if (search && search.trim()) {
            const keyword = `%${search.trim()}%`;
            whereConditions.push({
                [Op.or]: [
                    { title: { [Op.like]: keyword } },
                    { description: { [Op.like]: keyword } },
                    { tags: { [Op.like]: keyword } },
                    { assignedTo: { [Op.like]: keyword } }
                ]
            });
        }

        const where = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

        const allowedSortFields = ['id', 'title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const direction = String(sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const order = [[sortField, direction]];

        const { page, limit, offset } = getPaginationParams(req.query, 10, 100);

        const { count, rows } = await Task.findAndCountAll({
            where,
            limit,
            offset,
            order
        });

        const paginatedData = formatPaginatedResponse(rows, count, page, limit);

        const responseMessage = isMyTasksOnly
            ? 'My tasks retrieved successfully'
            : 'Tasks retrieved successfully';

        return responseHandler.successResponseData(
            res,
            paginatedData.items,
            200,
            responseMessage,
            { pagination: paginatedData.pagination }
        );
    } catch (err) {
        console.error('Task list error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Something went wrong while retrieving tasks',
            500
        );
    }
}

module.exports = {
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    myTaskList
};
