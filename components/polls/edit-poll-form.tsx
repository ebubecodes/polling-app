"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { editPollAction } from "@/lib/actions/polls";
import { useRouter } from "next/navigation";

interface PollOption {
  id: string;
  text: string;
  order_index: number;
}

interface Poll {
  id: string;
  title: string;
  description: string | null;
  question: string;
  allow_multiple: boolean;
  require_auth: boolean;
  end_date: string | null;
  poll_options: PollOption[];
}

interface EditPollFormProps {
  poll: Poll;
}

export function EditPollForm({ poll }: EditPollFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const router = useRouter();

  // Initialize options from existing poll data
  useEffect(() => {
    if (poll.poll_options) {
      const sortedOptions = poll.poll_options
        .sort((a, b) => a.order_index - b.order_index)
        .map(option => option.text);
      setOptions(sortedOptions);
    }
  }, [poll]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await editPollAction(poll.id, formData);
    } catch (error) {
      console.error("Error updating poll:", error);
      setIsSubmitting(false);
      // You could add error handling UI here
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    setOptions(options.map((opt, i) => i === index ? value : opt));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Poll</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <div className="flex space-x-1 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'basic'
              ? 'bg-secondary text-secondary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Basic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'settings'
              ? 'bg-secondary text-secondary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Settings
        </button>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div hidden={activeTab !== 'basic'}>
          <Card>
            <CardHeader>
              <CardTitle>Poll Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update the details for your poll.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={poll.title}
                  placeholder="Enter a question or title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  name="question"
                  defaultValue={poll.question}
                  placeholder="What should people vote on?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={poll.description || ""}
                  placeholder="Provide more context about your poll"
                />
              </div>

              <div className="space-y-2">
                <Label>Poll Options</Label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        name="options"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="mt-2"
                >
                  Add Option
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div hidden={activeTab !== 'settings'}>
          <Card>
            <CardHeader>
              <CardTitle>Poll Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure additional options for your poll.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowMultiple"
                  name="allowMultiple"
                  defaultChecked={poll.allow_multiple}
                />
                <Label htmlFor="allowMultiple">
                  Allow users to select multiple options
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireAuth"
                  name="requireAuth"
                  defaultChecked={poll.require_auth}
                />
                <Label htmlFor="requireAuth">
                  Require users to be logged in to vote
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Poll End Date (Optional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  defaultValue={poll.end_date ? new Date(poll.end_date).toISOString().slice(0, 16) : ""}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Updating Poll..." : "Update Poll"}
          </Button>
        </div>
      </form>
    </div>
  );
}
