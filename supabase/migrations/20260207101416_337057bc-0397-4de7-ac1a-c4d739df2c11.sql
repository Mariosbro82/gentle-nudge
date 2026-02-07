-- Drop the existing authenticated-only insert policy
DROP POLICY IF EXISTS "Authenticated can insert leads" ON leads;

-- Allow anyone (including anonymous visitors) to insert leads
CREATE POLICY "Anyone can insert leads"
ON leads
FOR INSERT
WITH CHECK (true);
