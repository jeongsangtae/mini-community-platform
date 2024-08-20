const useErrorHandling = () => {
  const errorHandler = (error, errorMessage) => {
    console.error("에러 내용:", error.message);
    alert(errorMessage);
  };

  return { errorHandler };
};

export default useErrorHandling;
