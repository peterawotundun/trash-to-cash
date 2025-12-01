-- Drop the restrictive admin-only insert policy
DROP POLICY IF EXISTS "Admins can insert companies" ON public.companies;

-- Allow authenticated users to insert their own company
CREATE POLICY "Authenticated users can create companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (true);