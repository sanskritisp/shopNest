const ApiResponse = (statusCode = 200,
    data = null, message = 'success') => {
    return {
        statusCode,
        message,
        success: statusCode < 400,
        data
    }

}
export default ApiResponse;