import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/polls/poll-card";

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    question: "What programming language do you prefer to use?",
    optionsCount: 5,
    totalVotes: 42,
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    title: "Best Frontend Framework",
    question: "Which frontend framework do you think is the best?",
    optionsCount: 4,
    totalVotes: 38,
    createdAt: "2023-10-10",
  },
  {
    id: "3",
    title: "Preferred Database",
    question: "What database do you prefer to work with?",
    optionsCount: 5,
    totalVotes: 27,
    createdAt: "2023-10-05",
  },
];

export default function PollsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Polls</h1>
        <Button asChild>
          <Link href="/polls/new">Create New Poll</Link>
        </Button>
      </div>

      {mockPolls.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">No polls yet</h3>
          <p className="text-muted-foreground mb-6">Create your first poll to get started!</p>
          <Button asChild>
            <Link href="/polls/new">Create Your First Poll</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}


