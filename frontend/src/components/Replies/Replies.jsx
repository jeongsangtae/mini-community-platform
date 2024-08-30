import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import Reply from "./Reply";
import ReplyForm from "./ReplyForm";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./Replies.module.css";

const Replies = ({ commentId, replyToggle, onReplyToggle, repliesLength }) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  const [replies, setReplies] = useState([]);

  // 컴포넌트가 마운트될 때 답글 데이터를 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;

      try {
        // 서버에서 특정 게시글의 특정 댓글에 대한 답글을 가져오는 API 호출
        const response = await fetch(
          "http://localhost:3000/posts/" + postId + "/" + commentId + "/replies"
        );

        if (!response.ok) {
          throw new Error("답글 조회 실패");
        }

        const resData = await response.json();

        setReplies(resData.replies);
        repliesLength(resData.replies.length); // 답글의 수를 부모 컴포넌트에 전달
      } catch (error) {
        authCtx.errorHelper(
          error,
          "답글을 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
        );
      }
    };

    fetchData();
  }, []);

  const addReply = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
  };

  const editReply = (editReply) => {
    setReplies((prevReplies) => {
      return prevReplies.map((reply) => {
        if (reply._id === editReply._id) {
          return { ...reply, content: editReply.content, date: editReply.date };
        }
        return reply;
      });
    });
  };

  const deleteReply = (replyId) => {
    setReplies((prevReplies) =>
      prevReplies.filter((reply) => reply._id !== replyId)
    );
  };

  return (
    <>
      {/* 답글 작성 폼을 조건부로 렌더링 */}
      {replyToggle && (
        <ReplyForm
          method="POST"
          commentId={commentId}
          onAddReplyData={addReply}
          onReplyToggle={onReplyToggle}
        />
      )}
      {/* 답글이 있는 경우, 밑줄을 렌더링 */}
      {replies.length > 0 && (
        <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
      )}
      {/* 답글이 있을 경우에만 렌더링 */}
      {replies.length > 0 && (
        <ul>
          {replies.map((reply) => {
            return (
              <Reply
                key={reply._id}
                replyId={reply._id}
                name={reply.name}
                email={reply.email}
                content={reply.content}
                date={reply.date}
                commentId={commentId}
                onDeleteReplyData={deleteReply}
                onEditReplyData={editReply}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Replies;
