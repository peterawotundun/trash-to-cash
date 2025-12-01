-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true);

-- Allow authenticated users to upload their company logo
CREATE POLICY "Companies can upload their own logo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their company logo
CREATE POLICY "Companies can update their own logo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their company logo
CREATE POLICY "Companies can delete their own logo"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow everyone to view company logos (public bucket)
CREATE POLICY "Anyone can view company logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'company-logos');