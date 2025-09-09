-- Add anonymous_voter_id to votes table
ALTER TABLE public.votes
ADD COLUMN anonymous_voter_id UUID;

-- Create an index on the new column for faster lookups
CREATE INDEX IF NOT EXISTS idx_votes_anonymous_voter_id ON public.votes(anonymous_voter_id);

-- Update the unique constraint to include anonymous_voter_id
-- First, drop the old constraint
ALTER TABLE public.votes
DROP CONSTRAINT IF EXISTS votes_poll_id_option_id_voter_id_voter_ip_key;

-- Add the new constraint
ALTER TABLE public.votes
ADD CONSTRAINT votes_poll_id_option_id_voter_id_anonymous_voter_id_key
UNIQUE (poll_id, option_id, voter_id, anonymous_voter_id);
