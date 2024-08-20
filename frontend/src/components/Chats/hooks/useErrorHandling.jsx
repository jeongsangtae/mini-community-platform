const useErrorHandling = () => {
  // Fetch 함수 내에서 발생한 에러를 처리하고 재사용할 수 있는 헬퍼 함수
  const errorHandler = (error, errorMessage) => {
    console.error("에러 내용:", error.message);
    alert(errorMessage);
  };

  return { errorHandler };
};

export default useErrorHandling;
