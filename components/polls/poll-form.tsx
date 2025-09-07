"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createPollAction } from "@/lib/actions/polls";
import { useRouter } from "next/navigation";

/**
 * Renders a multi-tabbed form for creating a new poll.
 * It handles the entire poll creation process, including basic info, settings, and dynamic poll options.
 * This component is a client component and manages its own state for UI interactivity.
 * On submission, it calls the `createPollAction` server action.
 */
export function PollForm() {
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createPollAction(formData);
      // No need to set isSubmitting back to false, as we'll be redirecting
    } catch (error) {
      console.error("Error creating poll:", error);
      setIsSubmitting(false);
      // You could add error handling UI here
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Create New Poll</h1>
        <Button variant="outline" onClick={() => router.push("/polls")}>
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit(formData);
        }}
        className="space-y-6"
      >
        <div hidden={activeTab !== 'basic'}>
          <Card>
            <CardHeader>
              <CardTitle>Poll Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the details for your new poll.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a question or title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  name="question"
                  placeholder="What should people vote on?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Provide more context about your poll"
                />
              </div>

              <div className="space-y-2">
                <Label>Poll Options</Label>
                <PollOptionsInput />
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
                />
                <Label htmlFor="allowMultiple">
                  Allow users to select multiple options
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireAuth"
                  name="requireAuth"
                  defaultChecked
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
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creating Poll..." : "Create Poll"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function PollOptionsInput() {
  const [options, setOptions] = useState<string[]>(["", ""]);

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
      <Button
        type="button"
        variant="outline"
        onClick={addOption}
        className="mt-2"
      >
        Add Option
      </Button>
    </div>
  );
}


