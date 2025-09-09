-- Update RLS policies to remove the dependency on the voter_ip column.
-- This is necessary before the column can be dropped.
-- The new policy only allows authenticated users to update or delete their votes.

ALTER POLICY "Users can update their own votes" ON public.votes
    USING (auth.uid() = voter_id);

ALTER POLICY "Users can delete their own votes" ON public.votes
    USING (auth.uid() = voter_id);

-- Drop redundant columns from the votes table now that they are no longer referenced in any policies.
ALTER TABLE public.votes
DROP COLUMN IF EXISTS voter_ip,
DROP COLUMN IF EXISTS voter_user_agent;