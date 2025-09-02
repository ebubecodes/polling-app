import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { PollForm } from "@/components/polls/poll-form";

export default async function NewPollPage() {
	const supabase = await createServerSupabaseClient();
	const { data: { session } } = await supabase.auth.getSession();
	if (!session) {
		redirect("/sign-in");
	}

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<PollForm />
		</div>
	);
}


