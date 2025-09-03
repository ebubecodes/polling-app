"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deletePollAction } from "@/lib/actions/polls";

interface PollActionsProps {
  pollId: string;
}

export function PollActions({ pollId }: PollActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/polls/${pollId}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deletePollAction(pollId);
      // Redirect is handled by the server action, no need to push here.
    } catch (err) {
      console.error("Error deleting poll:", err);
      setError("Failed to delete poll. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleEdit}>
        Edit Poll
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteConfirm(true)}
      >
        Delete
      </Button>
    </div>
  );
}
