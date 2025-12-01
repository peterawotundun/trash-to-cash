-- Add customization fields to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS company_slug text UNIQUE,
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#059669',
ADD COLUMN IF NOT EXISTS welcome_message text DEFAULT 'Welcome to our recycling rewards program!',
ADD COLUMN IF NOT EXISTS min_withdrawal_amount numeric DEFAULT 1000;

-- Create index on company_slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(company_slug);

-- Function to generate company slug from name
CREATE OR REPLACE FUNCTION generate_company_slug(company_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter int := 0;
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  base_slug := lower(regexp_replace(company_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check if slug exists and append number if needed
  WHILE EXISTS (SELECT 1 FROM public.companies WHERE company_slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;