import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/Authcontext";
import type { Comment } from "@/types/post.interface";
import { useUpdateComment } from "../hooks/useUpdateComment";
import { useCreateComment } from "../hooks/useCreateComment";

const CommentItem = ({
  comment,
  postId,
}: {
  comment: Comment;
  postId: number;
}) => {
  // Add a local state to hold the 'live' version of the text
  const [displayText, setDisplayText] = useState(comment.comment);
  const [updateComment, setUpdateComment] = useState(comment.comment);

  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Reply
  const { mutate: create, isPending: isReplyPending } =
    useCreateComment(postId);
  const onSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    create(
      { comment: replyText, authorId: user.id, postId, parentId: comment.id },
      {
        onSuccess: () => {
          setIsReplying(false);
        },
      },
    );
  };

  // Edit Comment
  const { mutate: update, isPending } = useUpdateComment();
  const onSubmitEditComment = (e: React.FormEvent) => {
    e.preventDefault();

    update(
      { postId, updateComment, id: comment.id },
      {
        onSuccess: () => {
          setIsUpdating(false);
          setDisplayText(updateComment);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2 border-l-2 pl-4 mt-4 border-zinc-500">
      <div className="flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-700 p-3 rounded">
        <p className="text-xs font-bold">{comment.author?.name}</p>
        <p>{displayText}</p>
        {/* Edit Comment */}
        {user && (
          <section className="p-2 ">
            {user.id === comment.authorId && (
              <Button onClick={() => setIsUpdating(true)} disabled={isUpdating}>
                Edit Your Comment
              </Button>
            )}
            {/* Update Comment Form */}
            {isUpdating && (
              <form onSubmit={onSubmitEditComment}>
                <Textarea
                  id="comment"
                  placeholder="Comment"
                  value={updateComment}
                  onChange={(e) => setUpdateComment(e.target.value)}
                />
                <Button disabled={isPending}>
                  {isPending ? "Updating Comment..." : "Update Comment"}
                </Button>
                <Button onClick={() => setIsUpdating(false)}>Cancel</Button>
              </form>
            )}
          </section>
        )}

        {/* Reply Button */}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            {isReplying ? "Cancel" : "Reply"}
          </Button>
        )}
      </div>

      {/* Localized Reply Form */}
      {user && isReplying && (
        <form
          onSubmit={onSubmitReply}
          className="ml-4 mt-2 flex flex-col gap-2"
        >
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button type="submit">{isReplyPending ? "Replying" : "Reply"}</Button>
          <Button onClick={() => setIsReplying(false)}>Cancel</Button>
        </form>
      )}

      {/* Recursion: Render replies of THIS comment */}
      {comment.replies?.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} />
      ))}
    </div>
  );
};

export default CommentItem;
