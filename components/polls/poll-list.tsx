import Link from "next/link";

type Poll = { id: string; title: string };

export function PollList({ polls = [] }: { polls?: Poll[] }) {
  if (polls.length === 0) {
    return <p className="text-sm text-muted-foreground">No polls yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {polls.map((poll) => (
        <li key={poll.id}>
          <Link href={`/polls/${poll.id}`} className="underline">
            {poll.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}


