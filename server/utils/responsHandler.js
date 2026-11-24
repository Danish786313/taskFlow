const responseHandler = {
    successResponseData(res, data, code = 200, message = 'Success', extras) {
        const statusCode = (typeof code === 'number' && code >= 100 && code < 600) ? code : 200;
        const response = {
            data,
            message: message,
        };
        if (extras) {
            Object.keys(extras).forEach((key) => {
                if ({}.hasOwnProperty.call(extras, key)) {
                    response[key] = extras[key];
                }
            });
        }
        return res.status(statusCode).send(response);
    },

    successResponseWithoutData(res, message = 'Success', code = 200) {
        const statusCode = (typeof code === 'number' && code >= 100 && code < 600) ? code : 200;
        const response = {
            message: message,
        };
        return res.status(statusCode).send(response);
    },

    errorResponseWithoutData(res, message = 'An error occurred', code = 400) {
        const statusCode = (typeof code === 'number' && code >= 100 && code < 600) ? code : 400;
        const response = {
            message: message,
        };
        return res.status(statusCode).send(response);
    },

    errorResponseData(res, message = 'An error occurred', code = 400, data = null) {
        const statusCode = (typeof code === 'number' && code >= 100 && code < 600) ? code : 400;
        const response = {
            message: message,
            ...(data ? { data } : {})
        };
        return res.status(statusCode).send(response);
    },

    validationErrorResponseData(res, message = 'Validation error', code = 400) {
        const statusCode = (typeof code === 'number' && code >= 100 && code < 600) ? code : 400;
        const response = {
            message: message
        };
        return res.status(statusCode).send(response);
    },

    ValidationError(err) {
        let error = {};
        if (err && err.name === 'ValidationError' && err.isJoi === true) {
            error.error_message = err.message.replace(/"/g, '');
            error.error_key = err.details && err.details[0] && err.details[0]['context'] ? err.details[0]['context']['label'] : 'field';
        } else if (typeof err === 'string') {
            error.error_message = err;
        } else {
            error = err || {};
            if (error.status === 401) error.message = 'unauthorized';
        }
        error.status = error.status || 400;
        return error;
    }
};

module.exports = responseHandler;
