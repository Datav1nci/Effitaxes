const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function getEnv(key) {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const line = envFile.split('\n').find(l => l.startsWith(key + '='));
        if (line) return line.split('=')[1].trim().replace(/^["']|["']$/g, '');
    } catch (e) {
        console.error("Error reading .env.local:", e.message);
    }
    return process.env[key];
}

async function checkDb() {
    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase env vars, found:", { supabaseUrl, supabaseKey });
        return;
    }

    // Use Service Role if available to bypass RLS for checking existence
    // If not, use Anon key (which will be subject to RLS)
    const client = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

    console.log("Checking 'households' table...");
    const { data: households, error: hError } = await client.from('households').select('*').limit(1);
    if (hError) {
        console.error("Error accessing households table:", hError.message);
    } else {
        console.log("Households table exists. Rows found (limit 1):", households.length);
    }

    console.log("Checking 'household_members' table...");
    const { data: members, error: mError } = await client.from('household_members').select('*').limit(1);
    if (mError) {
        console.error("Error accessing household_members table:", mError.message);
    } else {
        console.log("Household_members table exists. Rows found (limit 1):", members.length);
    }
}

checkDb();
