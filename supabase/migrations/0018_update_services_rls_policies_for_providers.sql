DROP POLICY IF EXISTS "services_provider_manage" ON public.services;
CREATE POLICY "services_provider_manage" ON public.services 
FOR ALL TO authenticated USING (auth.uid() = provider_id) WITH CHECK (auth.uid() = provider_id);

DROP POLICY IF EXISTS "services_insert" ON public.services;
CREATE POLICY "services_insert" ON public.services 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = provider_id);