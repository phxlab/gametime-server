const handleHonoErrors = (error: any) => {
  // Request Error
  if (error.name === 'SyntaxError') {
    error.statusCode = 400;
    return error;
  }

  // General Code Errors
  if (error.name === 'TypeError') {
    error.message = 'Internal Server Error';
    error.statusCode = 500;
  }

  return error;
};

export default handleHonoErrors;
