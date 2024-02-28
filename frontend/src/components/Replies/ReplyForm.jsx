const ReplyForm = () => {
  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <textarea
          required
          name="content"
          rows="5"
          placeholder="내용 입력"
          // defaultValue={commentData ? commentData.content : ""}
          // onChange={commentInputHandler}
        />
        <button>등록</button>
        <button>취소</button>
      </form>
    </>
  );
};

export default ReplyForm;
