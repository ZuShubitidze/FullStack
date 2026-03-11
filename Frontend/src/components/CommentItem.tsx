import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/components/hooks/createComment";
import { useAuth } from "@/context/Authcontext";
import type { Comment } from "@/types/post.interface";
import { updateCommentHook } from "./hooks/updateComment";
import { toast } from "sonner";

const CommentItem = ({
  comment,
  postId,
  onCommentAdded,
}: {
  comment: Comment;
  postId: number;
  onCommentAdded: () => void;
}) => {
  // Add a local state to hold the 'live' version of the text
  const [displayText, setDisplayText] = useState(comment.comment);
  const [updateComment, setUpdateComment] = useState(comment.comment);

  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Call your existing hook
    const newReply = await createComment(
      replyText,
      user.id,
      postId,
      comment.id,
    );

    if (newReply) {
      setReplyText("");
      setIsReplying(false);
      toast.success("Replied Successfully");
      // Update Comments
      onCommentAdded();
    }
  };

  // Edit Comment
  const handleEditComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateCommentHook(updateComment, postId, comment.id);

    if (success) {
      setDisplayText(updateComment); // Update the UI immediately
      setIsUpdating(false);
      toast.success("Comment successfully updated");
    }
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
              <form onSubmit={handleEditComment}>
                <Textarea
                  id="comment"
                  placeholder="Comment"
                  value={updateComment}
                  onChange={(e) => setUpdateComment(e.target.value)}
                />
                <Button>Comment</Button>
              </form>
            )}
          </section>
        )}

        {/* Reply / Cancel Button */}
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
          onSubmit={handleSubmitReply}
          className="ml-4 mt-2 flex flex-col gap-2"
        >
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button type="submit">Send Reply</Button>
        </form>
      )}

      {/* Recursion: Render replies of THIS comment */}
      {comment.replies?.map((reply: any) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </div>
  );
};

export default CommentItem;
