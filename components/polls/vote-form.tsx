"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitVoteAction } from "@/lib/actions/polls";

interface PollOption {
  id: string;
  text: string;
  order_index: number;
}

interface VoteFormProps {
  pollId: string;
  options: PollOption[];
  allowMultiple: boolean;
}

/**
 * Renders a form for users to cast a vote on a poll.
 * It displays the poll options and handles the submission state.
 * After a successful vote, it shows a confirmation message.
 *
 * @param {VoteFormProps} props The props for the component.
 * @param {string} props.pollId The ID of the poll.
 * @param {PollOption[]} props.options An array of poll options to display.
 * @param {boolean} props.allowMultiple Whether the poll allows selecting multiple options (currently supports single selection).
 */
export function VoteForm({ pollId, options, allowMultiple }: VoteFormProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!selectedOptionId) {
      setError("Please select an option");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      formData.append("pollId", pollId);
      formData.append("optionId", selectedOptionId);
      
      const result = await submitVoteAction(formData);
      
      if (result.success) {
        setSuccess(true);
      } else if (result.error) {
        setError(result.error);
      } else {
        setError("An unexpected error occurred.");
      }
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError("Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionClick = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 dark:text-green-400 font-medium mb-2">
          Your vote has been submitted!
        </p>
        <p className="text-muted-foreground">
          Thank you for participating in this poll.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center p-3 border rounded-md transition-colors cursor-pointer ${selectedOptionId === option.id
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-muted/50"
              }`}
            onClick={() => handleOptionClick(option.id)}
          >
            <div className="flex-1">
              <span className="text-foreground">{option.text}</span>
            </div>
          </div>
        ))}

        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}

        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={isSubmitting || !selectedOptionId}
        >
          {isSubmitting ? "Submitting..." : "Submit Vote"}
        </Button>
      </div>
    </form>
  );
}