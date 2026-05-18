const apiResponse = (statusCode = 200,
    data = null, message = 'success') => {
    return {
        statusCode,
        message,
        success: statusCode < 200,
        data
    }

}
export default apiResponse;