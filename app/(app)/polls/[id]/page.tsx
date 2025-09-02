import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

// Mock data for demonstration
const mockPoll = {
  id: "1",
  title: "Favorite Programming Language",
  question: "What programming language do you prefer to use?",
  options: [
    { id: "1", text: "JavaScript", votes: 15 },
    { id: "2", text: "Python", votes: 12 },
    { id: "3", text: "Java", votes: 8 },
    { id: "4", text: "C#", votes: 4 },
    { id: "5", text: "Go", votes: 3 },
  ],
  totalVotes: 42,
  createdBy: "John Doe",
  createdAt: "2023-10-15",
};

export default async function PollPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(session);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/polls" 
          className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
        >
          ← Back to Polls
        </Link>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit Poll</Button>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            {mockPoll.title}
          </CardTitle>
          <p className="text-muted-foreground">
            {mockPoll.question}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockPoll.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center p-3 border border-border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <span className="text-foreground">{option.text}</span>
              </div>
            </div>
          ))}
          <Button className="w-full mt-4">Submit Vote</Button>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t">
            <span>Created by {mockPoll.createdBy}</span>
            <span>Created on {new Date(mockPoll.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share this poll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Copy Link
            </Button>
            <Button variant="outline" className="flex-1">
              Share on Twitter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
