import { useAuth } from "@/context/Authcontext";
import { useState } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { useCreateComment } from "../hooks/useCreateComment";

const CreateCommentComponent = ({ postId }: { postId: number }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  // Create Comment
  const { mutate: create, isPending } = useCreateComment(postId);
  const onSubmitCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    create(
      { comment, authorId: user.id, postId },
      {
        onSuccess: () => {
          setIsCommenting(false);
          setComment("");
        },
      },
    );
  };

  return (
    <div>
      {/* Commenting Section */}
      <section>
        {/* Check User */}
        {user && (
          <Button
            onClick={() => setIsCommenting(true)}
            disabled={isCommenting}
            className="mb-2 w-36"
          >
            Comment
          </Button>
        )}
        {/* Comment Form */}
        {isCommenting && (
          <form onSubmit={onSubmitCreateComment}>
            <Field>
              <Textarea
                id="comment"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button disabled={isPending}>
                {isPending ? "Commenting..." : "Comment"}
              </Button>
            </Field>
          </form>
        )}
      </section>
    </div>
  );
};

export default CreateCommentComponent;
