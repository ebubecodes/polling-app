import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PollList } from "@/components/polls/poll-list";

export default function PollsPage() {
  const examplePolls = [
    { id: "1", title: "Best JS framework?" },
    { id: "2", title: "Tabs vs Spaces" },
  ];
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Polls</h1>
        <Button>
          <Link href="/polls/new">New poll</Link>
        </Button>
      </div>
      <PollList polls={examplePolls} />
    </div>
  );
}


