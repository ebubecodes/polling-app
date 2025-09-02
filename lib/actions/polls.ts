"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { CreatePollData } from "@/lib/types/database";

export async function createPollAction(formData: FormData) {
	const supabase = await createServerSupabaseClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	if (!user) {
		redirect("/sign-in");
	}

	try {
		// Extract form data
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const question = formData.get("question") as string;
		const allowMultiple = formData.get("allowMultiple") === "on";
		const requireAuth = formData.get("requireAuth") === "on";
		const endDate = formData.get("endDate") as string;
		const options = formData.getAll("options") as string[];

		// Validate required fields
		if (!title || !question || options.length < 2) {
			throw new Error("Missing required fields");
		}

		// Filter out empty options
		const validOptions = options.filter(option => option.trim() !== "");

		// Create poll
		const { data: poll, error: pollError } = await supabase
			.from("polls")
			.insert({
				title: title.trim(),
				description: description.trim() || null,
				question: question.trim(),
				allow_multiple: allowMultiple,
				require_auth: requireAuth,
				end_date: endDate || null,
				owner_id: user.id,
			})
			.select()
			.single();

		if (pollError) {
			console.error("Error creating poll:", pollError);
			throw new Error("Failed to create poll");
		}

		// Create poll options
		const pollOptions = validOptions.map((text, index) => ({
			poll_id: poll.id,
			text: text.trim(),
			order_index: index,
		}));

		const { error: optionsError } = await supabase
			.from("poll_options")
			.insert(pollOptions);

		if (optionsError) {
			console.error("Error creating poll options:", optionsError);
			// Clean up the poll if options fail
			await supabase.from("polls").delete().eq("id", poll.id);
			throw new Error("Failed to create poll options");
		}

		revalidatePath("/polls");
		redirect(`/polls/${poll.id}`);
	} catch (error) {
		console.error("Error in createPollAction:", error);
		throw error;
	}
}

export async function deletePollAction(pollId: string) {
	const supabase = await createServerSupabaseClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	if (!user) {
		redirect("/sign-in");
	}

	try {
		// Verify ownership before delete
		const { data: poll, error: pollError } = await supabase
			.from("polls")
			.select("id, owner_id")
			.eq("id", pollId)
			.single();

		if (pollError || !poll) {
			throw new Error("Poll not found");
		}

		if (poll.owner_id !== user.id) {
			throw new Error("Unauthorized");
		}

		// Delete poll (cascades to options and votes)
		const { error: deleteError } = await supabase
			.from("polls")
			.delete()
			.eq("id", pollId);

		if (deleteError) {
			throw new Error("Failed to delete poll");
		}

		revalidatePath("/polls");
		redirect("/polls");
	} catch (error) {
		console.error("Error in deletePollAction:", error);
		throw error;
	}
}
