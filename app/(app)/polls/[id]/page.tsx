import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { notFound } from "next/navigation";
import { SharePoll } from "@/components/polls/share-poll";
import { PollActions } from "@/components/polls/poll-actions";

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

export default async function PollPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(session);

  // Fetch poll with options and vote counts
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
        id
      )
    `)
    .eq('id', params.id)
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

  // Sort options by order_index
  const sortedOptions = typedPoll.poll_options?.sort((a: PollOption, b: PollOption) => a.order_index - b.order_index) || [];

  // Check if current user is the poll owner
  const isOwner = session?.user?.id === typedPoll.owner_id;

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
          {sortedOptions.map((option: PollOption) => (
            <div
              key={option.id}
              className="flex items-center p-3 border border-border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <span className="text-foreground">{option.text}</span>
              </div>
            </div>
          ))}
          
          {typedPoll.end_date && new Date(typedPoll.end_date) < new Date() ? (
            <div className="text-center py-4 text-muted-foreground">
              This poll has ended
            </div>
          ) : (
            <Button className="w-full mt-4">Submit Vote</Button>
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
