-- #############################################################################
-- ### 1. Tables ###############################################################
-- #############################################################################

-- Create polls table
-- This table stores the core information for each poll.
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL, -- The main title of the poll.
    description TEXT, -- An optional, longer description for context.
    question TEXT NOT NULL, -- The question that users will vote on.
    allow_multiple BOOLEAN DEFAULT false, -- Whether users can select more than one option.
    require_auth BOOLEAN DEFAULT true, -- If true, only authenticated users can vote.
    end_date TIMESTAMP WITH TIME ZONE, -- An optional date when the poll automatically closes.
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- The user who created the poll.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll options table
-- This table stores the individual options that users can vote for in a poll.
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE, -- Foreign key to the polls table.
    text TEXT NOT NULL, -- The text content of the option (e.g., "Yes", "No").
    order_index INTEGER NOT NULL, -- The display order of the option in the list.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
-- This table records each individual vote cast on a poll.
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE, -- The poll this vote belongs to.
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE, -- The specific option that was chosen.
    voter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- The authenticated user who voted, if any.
    voter_ip INET, -- The IP address of the voter (for anonymous vote tracking).
    voter_user_agent TEXT, -- The user agent of the voter's browser.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- A unique constraint to prevent a user from voting for the same option multiple times.
    -- Note: This is a basic constraint. More robust duplicate prevention is handled in the application logic.
    UNIQUE(poll_id, option_id, voter_id, voter_ip)
);

-- #############################################################################
-- ### 2. Indexes ##############################################################
-- #############################################################################

-- Create indexes for better performance on frequently queried columns.
CREATE INDEX IF NOT EXISTS idx_polls_owner_id ON public.polls(owner_id);
CREATE INDEX IF NOT EXISTS idx_polls_created_at ON public.polls(created_at);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_order ON public.poll_options(poll_id, order_index);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON public.votes(option_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON public.votes(voter_id);

-- #############################################################################
-- ### 3. Row Level Security (RLS) #############################################
-- #############################################################################

-- Enable Row Level Security on all tables to ensure data access is restricted.
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls table
CREATE POLICY "Users can view all polls" ON public.polls
    FOR SELECT USING (true);

CREATE POLICY "Users can create polls" ON public.polls
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own polls" ON public.polls
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own polls" ON public.polls
    FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for poll_options table
CREATE POLICY "Users can view all poll options" ON public.poll_options
    FOR SELECT USING (true);

-- Users can only add options to polls they own.
CREATE POLICY "Users can create options for their polls" ON public.poll_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND owner_id = auth.uid()
        )
    );

-- Users can only update options on polls they own.
CREATE POLICY "Users can update options for their polls" ON public.poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND owner_id = auth.uid()
        )
    );

-- Users can only delete options from polls they own.
CREATE POLICY "Users can delete options for their polls" ON public.poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id AND owner_id = auth.uid()
        )
    );

-- RLS Policies for votes table
CREATE POLICY "Users can view all votes" ON public.votes
    FOR SELECT USING (true);

-- Users can only vote if the poll has not ended and meets the authentication requirements.
CREATE POLICY "Users can create votes" ON public.votes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.polls p
            WHERE p.id = poll_id 
            AND (p.end_date IS NULL OR p.end_date > NOW())
            AND (p.require_auth = false OR auth.uid() IS NOT NULL)
        )
    );

-- Users can only update their own votes.
CREATE POLICY "Users can update their own votes" ON public.votes
    FOR UPDATE USING (
        auth.uid() = voter_id OR 
        (voter_ip IS NOT NULL AND voter_ip = inet_client_addr())
    );

-- Users can only delete their own votes.
CREATE POLICY "Users can delete their own votes" ON public.votes
    FOR DELETE USING (
        auth.uid() = voter_id OR 
        (voter_ip IS NOT NULL AND voter_ip = inet_client_addr())
    );

-- #############################################################################
-- ### 4. Triggers and Functions ###############################################
-- #############################################################################

-- Function to automatically update the `updated_at` timestamp on polls.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

-- Trigger that calls the function whenever a poll is updated.
CREATE TRIGGER update_polls_updated_at 
    BEFORE UPDATE ON public.polls 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get poll results with vote counts and percentages.
-- This simplifies querying poll results from the application.
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
    option_id UUID,
    option_text TEXT,
    vote_count BIGINT,
    percentage NUMERIC
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        po.id as option_id,
        po.text as option_text,
        COUNT(v.id) as vote_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM public.votes WHERE poll_id = poll_uuid) > 0 
            THEN ROUND(
                (COUNT(v.id)::NUMERIC / (SELECT COUNT(*) FROM public.votes WHERE poll_id = poll_uuid)::NUMERIC) * 100, 
                1
            )
            ELSE 0 
        END as percentage
    FROM public.poll_options po
    LEFT JOIN public.votes v ON po.id = v.option_id
    WHERE po.poll_id = poll_uuid
    GROUP BY po.id, po.text, po.order_index
    ORDER BY po.order_index;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
