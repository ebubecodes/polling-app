export interface Poll {
  id: string;
  title: string;
  description: string | null;
  question: string;
  allow_multiple: boolean;
  require_auth: boolean;
  end_date: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  order_index: number;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  voter_id: string | null;
  voter_ip: string | null;
  voter_user_agent: string | null;
  created_at: string;
}

export interface PollWithOptions extends Poll {
  options: PollOption[];
}

export interface PollWithResults extends PollWithOptions {
  total_votes: number;
  results: PollResult[];
}

export interface PollResult {
  option_id: string;
  option_text: string;
  vote_count: number;
  percentage: number;
}

export interface CreatePollData {
  title: string;
  description?: string;
  question: string;
  allow_multiple: boolean;
  require_auth: boolean;
  end_date?: string;
  options: string[];
}

export interface VoteData {
  poll_id: string;
  option_ids: string[];
}
