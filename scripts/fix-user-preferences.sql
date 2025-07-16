-- This script is intended to fix or update the 'user_preferences' table.
-- It can be used to add new columns, modify existing ones, or set default values.

-- Example 1: Add a new column 'timezone' if it doesn't exist
DO $$ BEGIN
    ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "timezone" TEXT DEFAULT 'UTC';
    RAISE NOTICE 'Column "timezone" added to "user_preferences" table.';
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column "timezone" already exists in "user_preferences".';
END $$;

-- Example 2: Update default value for 'notificationsEnabled' if it's null
UPDATE "user_preferences"
SET "notificationsEnabled" = TRUE
WHERE "notificationsEnabled" IS NULL;

RAISE NOTICE 'Updated "notificationsEnabled" to TRUE where it was NULL.';

-- Example 3: Change the default value for 'learningPace' to 'adaptive'
-- This requires dropping and re-adding the column or altering its default.
-- Be careful with existing data.
-- ALTER TABLE "user_preferences" ALTER COLUMN "learningPace" SET DEFAULT 'adaptive';
-- RAISE NOTICE 'Default for "learningPace" changed to "adaptive".';

-- Example 4: Add a unique constraint on userId if it's missing (though it should be there from init-database.sql)
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "user_preferences_userId_key" ON "user_preferences"("userId");
    RAISE NOTICE 'Unique index on "userId" for "user_preferences" ensured.';
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Unique index on "userId" for "user_preferences" already exists.';
END $$;

-- Example 5: Add a 'learningStyle' column to the User table if it doesn't exist
-- This assumes your User table is named "User" and has an "id" column.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='learningStyle') THEN
        ALTER TABLE "User" ADD COLUMN "learningStyle" TEXT DEFAULT 'reading-writing';
        RAISE NOTICE 'Added learningStyle column to User table.';
    ELSE
        RAISE NOTICE 'learningStyle column already exists in User table.';
    END IF;
END
$$;

-- Example 6: Update existing user's learning style if it's null
-- UPDATE "User" SET "learningStyle" = 'reading-writing' WHERE "learningStyle" IS NULL;

-- Example 7: Clean up invalid learning style values
-- UPDATE "User" SET "learningStyle" = 'reading-writing' WHERE "learningStyle" NOT IN ('visual', 'auditory', 'kinesthetic', 'reading-writing');

-- Remember to run `npx prisma db push` after making schema changes in schema.prisma
-- and then `npm run db:seed` if you need to update seed data.

SELECT 'User preferences fix script executed. Review the output for any changes made.' AS status;
