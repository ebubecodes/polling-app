import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Poll {
  id: string;
  title: string;
  question: string;
  optionsCount: number;
  totalVotes: number;
  createdAt: string;
}

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <Link href={`/polls/${poll.id}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
            {poll.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {poll.question}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{poll.optionsCount} options</span>
            <span>{poll.totalVotes} total votes</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Created on {formatDate(poll.createdAt)}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
