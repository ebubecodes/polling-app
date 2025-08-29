"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PollForm() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What should we vote on?" />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <Input key={idx} value={opt} onChange={(e) => setOptions(options.map((v, i) => (i === idx ? e.target.value : v)))} placeholder={`Option ${idx + 1}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setOptions([...options, ""])}>Add option</Button>
          {options.length > 2 && (
            <Button type="button" variant="ghost" onClick={() => setOptions(options.slice(0, -1))}>Remove last</Button>
          )}
        </div>
      </div>
      <Button type="submit">Create poll</Button>
    </form>
  );
}


