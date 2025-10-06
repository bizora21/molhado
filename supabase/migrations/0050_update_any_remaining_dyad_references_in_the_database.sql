-- Check for any dyad references in the database
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND (column_name ILIKE '%dyad%' OR table_name ILIKE '%dyad%');