import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { notFound } from "next/navigation";
import { SharePoll } from "@/components/polls/share-poll";
import { PollActions } from "@/components/polls/poll-actions";
import { VoteForm } from "@/components/polls/vote-form";
import { PollResultsChart } from "@/components/polls/poll-results-chart";

interface PollOption {
  id: string;
  text: string;
  order_index: number;
}

interface Vote {
  id: string;
}

interface PollWithDetails {
  id: string;
  title: string;
  description: string | null;
  question: string;
  owner_id: string;
  created_at: string;
  end_date: string | null;
  poll_options: PollOption[];
  votes: Vote[];
}

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(user);

  // Fetch poll with options and vote counts (include option_id in votes)
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        order_index
      ),
      votes (
        id,
        option_id
      )
    `)
    .eq('id', id)
    .single();

  if (pollError || !poll) {
    console.error('Error fetching poll:', pollError);
    notFound();
  }

  const typedPoll = poll as PollWithDetails;

  // Get user info for the poll owner
  const { data: ownerUser } = await supabase.auth.admin.getUserById(typedPoll.owner_id);
  const ownerName = ownerUser?.user?.email?.split('@')[0] || 'Unknown User';

  // Calculate total votes
  const totalVotes = typedPoll.votes?.length || 0;

  // Prepare votes with option_id for chart
  const votesWithOption = (poll.votes || []) as Array<{ id: string; option_id: string }>;

  // Sort options by order_index
  const sortedOptions = typedPoll.poll_options?.sort((a: PollOption, b: PollOption) => a.order_index - b.order_index) || [];

  // Check if current user is the poll owner
  const isOwner = user?.id === typedPoll.owner_id;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/polls" 
          className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
        >
          ← Back to Polls
        </Link>
        {isAuthenticated && isOwner && (
          <PollActions pollId={typedPoll.id} />
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            {typedPoll.title}
          </CardTitle>
          {typedPoll.description && (
            <p className="text-muted-foreground">
              {typedPoll.description}
            </p>
          )}
          <p className="text-muted-foreground">
            {typedPoll.question}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {typedPoll.end_date && new Date(typedPoll.end_date) < new Date() ? (
            <>
              <PollResultsChart
                options={sortedOptions.map(o => ({ id: o.id, text: o.text }))}
                votes={votesWithOption}
              />
              <div className="text-center py-4 text-muted-foreground">
                This poll has ended
              </div>
              {isOwner && (
                <div className="flex justify-center mt-4">
                  <Link
                    href={`/polls/${typedPoll.id}/edit`}
                    className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    Edit Poll
                  </Link>
                </div>
              )}
            </>
          ) : (
            <VoteForm
              pollId={typedPoll.id}
              options={sortedOptions}
              allowMultiple={false}
            />
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t">
            <span>Created by {ownerName}</span>
            <span>Created on {new Date(typedPoll.created_at).toLocaleDateString()}</span>
          </div>
          
          {totalVotes > 0 && (
            <div className="text-sm text-muted-foreground text-center pt-2">
              {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>

      <SharePoll />
    </div>
  );
}
