import { useAuth } from "@/context/Authcontext";
import { useState } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { createComment } from "./hooks/createComment";
import { Textarea } from "./ui/textarea";

const CreateCommentComponent = ({ postId }: { postId: number }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();

    await createComment(comment, user.id, postId);
    setIsCommenting(false);
  };

  return (
    <div>
      {/* Commenting Section */}
      <section>
        {/* Allow only logged in user to comment */}
        {user && (
          <Button
            onClick={() => setIsCommenting(true)}
            disabled={isCommenting}
            className="mb-2"
          >
            Comment
          </Button>
        )}
        {/* Comment Form */}
        {isCommenting && (
          <form onSubmit={handleCreateComment}>
            <Field>
              <Textarea
                id="comment"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button>Comment</Button>
            </Field>
          </form>
        )}
      </section>
    </div>
  );
};

export default CreateCommentComponent;
