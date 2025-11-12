-- Add cash reward settings to companies table
ALTER TABLE public.companies 
ADD COLUMN cash_reward_enabled boolean DEFAULT false,
ADD COLUMN points_per_kg numeric DEFAULT 10;

-- Add comment for clarity
COMMENT ON COLUMN public.companies.cash_reward_enabled IS 'Whether the company has enabled cash rewards for users';
COMMENT ON COLUMN public.companies.points_per_kg IS 'Points awarded per kg of waste deposited';