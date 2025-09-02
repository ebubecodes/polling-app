import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/polls/poll-card";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export default async function PollsPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch polls with their options and vote counts
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        order_index
      ),
      votes (
        id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching polls:', error);
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">Error loading polls</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Transform the data to match our component expectations
  const transformedPolls = polls?.map(poll => ({
    id: poll.id,
    title: poll.title,
    question: poll.question,
    optionsCount: poll.poll_options?.length || 0,
    totalVotes: poll.votes?.length || 0,
    createdAt: poll.created_at,
  })) || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Polls</h1>
        <Button asChild>
          <Link href="/polls/new">Create New Poll</Link>
        </Button>
      </div>

      {transformedPolls.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">No polls yet</h3>
          <p className="text-muted-foreground mb-6">Create your first poll to get started!</p>
          <Button asChild>
            <Link href="/polls/new">Create Your First Poll</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transformedPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}


