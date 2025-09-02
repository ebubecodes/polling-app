"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface PollFormData {
  title: string;
  description: string;
  options: string[];
  allowMultiple: boolean;
  requireAuth: boolean;
  endDate: string;
}

export function PollForm() {
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');
  const [formData, setFormData] = useState<PollFormData>({
    title: "",
    description: "",
    options: ["", ""],
    allowMultiple: false,
    requireAuth: true,
    endDate: "",
  });

  const updateFormData = (field: keyof PollFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement form submission
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Create New Poll</h1>
        <Button variant="outline">Cancel</Button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'basic' && (
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
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter a question or title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Provide more context about your poll"
                />
              </div>

              <div className="space-y-2">
                <Label>Poll Options</Label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {formData.options.length > 2 && (
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
        )}

        {activeTab === 'settings' && (
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
                  checked={formData.allowMultiple}
                  onCheckedChange={(checked) => 
                    updateFormData('allowMultiple', checked)
                  }
                />
                <Label htmlFor="allowMultiple">
                  Allow users to select multiple options
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireAuth"
                  checked={formData.requireAuth}
                  onCheckedChange={(checked) => 
                    updateFormData('requireAuth', checked)
                  }
                />
                <Label htmlFor="requireAuth">
                  Require users to be logged in to vote
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Poll End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => updateFormData('endDate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <Button type="submit" size="lg">
            Create Poll
          </Button>
        </div>
      </form>
    </div>
  );
}


