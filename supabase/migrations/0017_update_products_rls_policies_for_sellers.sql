DROP POLICY IF EXISTS "products_seller_manage" ON public.products;
CREATE POLICY "products_seller_manage" ON public.products 
FOR ALL TO authenticated USING (auth.uid() = store_id) WITH CHECK (auth.uid() = store_id);

DROP POLICY IF EXISTS "products_insert" ON public.products;
CREATE POLICY "products_insert" ON public.products 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = store_id);