DROP POLICY IF EXISTS "services_public_read" ON public.services;
CREATE POLICY "services_public_read" ON public.services 
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "services_provider_manage" ON public.services;
CREATE POLICY "services_provider_manage" ON public.services 
FOR ALL TO authenticated USING (auth.uid() = provider_id);

DROP POLICY IF EXISTS "services_insert" ON public.services;
CREATE POLICY "services_insert" ON public.services 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = provider_id);