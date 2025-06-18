-- SQL fix för att rensa dubletter i user_settings tabellen
-- Kör denna i Supabase SQL Editor om du får duplicate key constraint fel

-- 1. Kolla om det finns dubletter (kör först för att se om problemet finns)
SELECT 
    user_id, 
    COUNT(*) as antal_rader
FROM user_settings 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- 2. Om det finns dubletter, ta bort dem och behåll bara den senaste
WITH ranked_settings AS (
    SELECT 
        id,
        user_id,
        settings,
        created_at,
        updated_at,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) as rn
    FROM user_settings
)
DELETE FROM user_settings 
WHERE id IN (
    SELECT id 
    FROM ranked_settings 
    WHERE rn > 1
);

-- 3. Verifiera att det inte finns dubletter längre
SELECT 
    user_id, 
    COUNT(*) as antal_rader
FROM user_settings 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- 4. Om tabellen saknar UNIQUE constraint, lägg till det
-- (Detta borde redan finnas från database-setup.sql)
DO $$
BEGIN
    BEGIN
        ALTER TABLE user_settings ADD CONSTRAINT user_settings_user_id_unique UNIQUE (user_id);
        RAISE NOTICE 'UNIQUE constraint added successfully';
    EXCEPTION 
        WHEN duplicate_table THEN
            RAISE NOTICE 'UNIQUE constraint already exists';
        WHEN others THEN
            RAISE NOTICE 'Could not add UNIQUE constraint: %', SQLERRM;
    END;
END $$;

-- 5. Bekräfta att constraint finns
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'user_settings'::regclass 
    AND contype = 'u'; 