import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { EditPollForm } from "@/components/polls/edit-poll-form";
import { notFound } from "next/navigation";

export default async function EditPollPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/sign-in");
  }

  // Fetch poll with options
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        order_index
      )
    `)
    .eq('id', params.id)
    .single();

  if (pollError || !poll) {
    console.error('Error fetching poll:', pollError);
    notFound();
  }

  // Check if user owns this poll
  if (poll.owner_id !== session.user.id) {
    redirect("/polls");
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <EditPollForm poll={poll} />
    </div>
  );
}
