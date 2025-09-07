"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

/**
 * Server action to create a new poll.
 * Authenticates the user, validates form data, and inserts the poll and its options into the database.
 * Redirects to the new poll's page on success.
 * @param formData The form data submitted by the user.
 * @throws Throws an error if the user is not authenticated, if required fields are missing, or if there's a database error.
 */
export async function createPollAction(formData: FormData) {
	const supabase = await createServerSupabaseClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	if (!user) {
		redirect("/sign-in");
	}

	let pollId: string | null = null;

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

		pollId = poll.id;

	} catch (error) {
		console.error("Error in createPollAction:", error);
		throw error; // Re-throw the error to be handled by the caller or an error boundary
	}

	// Redirect only after the try-catch block has completed successfully
	if (pollId) {
		revalidatePath("/polls");
		redirect(`/polls/${pollId}`);
	}
}

/**
 * Server action to edit an existing poll.
 * Verifies that the current user is the owner of the poll before applying updates.
 * Deletes and re-inserts poll options to reflect changes.
 * Redirects to the updated poll's page on success.
 * @param pollId The ID of the poll to edit.
 * @param formData The form data containing the updated poll information.
 * @throws Throws an error if the user is not authenticated, not the owner, or if there's a database error.
 */
export async function editPollAction(pollId: string, formData: FormData) {
	const supabase = await createServerSupabaseClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	if (!user) {
		redirect("/sign-in");
	}

	try {
		// Verify ownership before editing
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

		// Update poll
		const { error: updateError } = await supabase
			.from("polls")
			.update({
				title: title.trim(),
				description: description.trim() || null,
				question: question.trim(),
				allow_multiple: allowMultiple,
				require_auth: requireAuth,
				end_date: endDate || null,
			})
			.eq("id", pollId);

		if (updateError) {
			console.error("Error updating poll:", updateError);
			throw new Error("Failed to update poll");
		}

		// Delete existing options
		await supabase
			.from("poll_options")
			.delete()
			.eq("poll_id", pollId);

		// Create new poll options
		const pollOptions = validOptions.map((text, index) => ({
			poll_id: pollId,
			text: text.trim(),
			order_index: index,
		}));

		const { error: optionsError } = await supabase
			.from("poll_options")
			.insert(pollOptions);

		if (optionsError) {
			console.error("Error updating poll options:", optionsError);
			throw new Error("Failed to update poll options");
		}

	} catch (error) {
		console.error("Error in editPollAction:", error);
		throw error;
	}

	// Redirect after successful update
	revalidatePath("/polls");
	revalidatePath(`/polls/${pollId}`);
	redirect(`/polls/${pollId}`);
}

/**
 * Server action to delete a poll.
 * Verifies that the current user is the owner of the poll before deleting it.
 * The deletion cascades in the database to also remove related poll options and votes.
 * Redirects to the main polls list on success.
 * @param pollId The ID of the poll to delete.
 * @throws Throws an error if the user is not authenticated, not the owner, or if there's a database error.
 */
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

	} catch (error) {
		console.error("Error in deletePollAction:", error);
		throw error;
	}

	// Redirect after successful deletion
	revalidatePath("/polls");
	redirect("/polls");
}

/**
 * Server action to submit a vote on a poll.
 * Checks if the poll requires authentication and if the user has already voted.
 * Inserts the new vote into the database.
 * @param formData The form data containing the poll and option IDs.
 * @returns A promise that resolves to an object with a `success` boolean.
 * @throws Throws an error if required fields are missing, the poll is not found, the poll has ended, or the user has already voted.
 */
export async function submitVoteAction(formData: FormData) {
	const supabase = await createServerSupabaseClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	const pollId = formData.get("pollId") as string;
	const optionId = formData.get("optionId") as string;
	
	if (!pollId || !optionId) {
		throw new Error("Missing required fields");
	}

	try {
		// Fetch poll to check if authentication is required
		const { data: poll, error: pollError } = await supabase
			.from("polls")
			.select("require_auth, end_date")
			.eq("id", pollId)
			.single();

		if (pollError || !poll) {
			throw new Error("Poll not found");
		}

		// Check if poll has ended
		if (poll.end_date && new Date(poll.end_date) < new Date()) {
			throw new Error("This poll has ended");
		}

		// Check if authentication is required
		if (poll.require_auth && !user) {
			redirect("/sign-in");
		}

		// Prevent duplicate votes for authenticated users
		if (user) {
			const { data: existingVote, error: existingVoteError } = await supabase
				.from("votes")
				.select("id")
				.eq("poll_id", pollId)
				.eq("voter_id", user.id)
				.single();

			if (existingVoteError && existingVoteError.code !== 'PGRST116') { // Ignore 'not found' error
				console.error("Error checking for existing vote:", existingVoteError);
				throw new Error("Failed to verify vote");
			}

			if (existingVote) {
				throw new Error("You have already voted on this poll");
			}
		}

		// Create vote
		const { error: voteError } = await supabase
			.from("votes")
			.insert({
				poll_id: pollId,
				option_id: optionId,
				voter_id: user?.id || null,
				voter_ip: null, // Could be implemented with middleware
				voter_user_agent: null, // Could be implemented with middleware
			});

		if (voteError) {
			console.error("Error submitting vote:", voteError);
			throw new Error("Failed to submit vote");
		}

	} catch (error) {
		console.error("Error in submitVoteAction:", error);
		throw error;
	}

	// Revalidate the poll page to show updated results
	revalidatePath(`/polls/${pollId}`);
	return { success: true };
}
