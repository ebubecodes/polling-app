import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { EditPollForm } from "@/components/polls/edit-poll-form";
import { notFound } from "next/navigation";

export default async function EditPollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params to resolve the promise
  const supabase = await createServerSupabaseClient();
  
  // Use getUser() for server-side authentication as recommended
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
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
    .eq('id', id) // Use the resolved id
    .single();

  if (pollError || !poll) {
    console.error('Error fetching poll:', pollError);
    notFound();
  }

  // Check if user owns this poll
  if (poll.owner_id !== user.id) {
    redirect("/polls");
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <EditPollForm poll={poll} />
    </div>
  );
}
