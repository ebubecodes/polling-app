"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export async function createPollAction(_formData: FormData) {
	const supabase = await createServerSupabaseClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		redirect("/sign-in");
	}

	// TODO: Insert into Supabase (polls, options) using user.id as owner_id
	// Placeholder to show enforcement path
	revalidatePath("/polls");
	redirect("/polls");
}

export async function deletePollAction(pollId: string) {
	const supabase = await createServerSupabaseClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		redirect("/sign-in");
	}

	// TODO: Verify ownership in DB before delete
	// await supabase.from('polls').delete().eq('id', pollId).eq('owner_id', user.id)

	revalidatePath("/polls");
}
