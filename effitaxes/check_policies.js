
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

async function checkPolicies() {
    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    // Need Service Role Key to query system tables usually, or if RLS is enabled on pg_policies (it's not usually)
    const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing Supabase env vars (need service role for this)");
        return;
    }

    const client = createClient(supabaseUrl, serviceRoleKey);

    // Supabase exposes pg_policies via RPC usually or we can try direct select if exposed
    // But direct SQL execution via client is not possible without RPC.
    // However, we can check if RLS is enabled on tables via postgrest if mapped? No.

    // Alternative: Try to select from 'households' using a FAKE user token and see if it fails/returns empty.

    // Creating a dummy user client is hard without a valid token.

    // Let's rely on the previous check: tables exist.
    // Let's Try to insert a row using ANON key and see if it fails (it should fail if RLS works and no user).
    // Or if it succeeds (if RLS disabled).

    const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const anonClient = createClient(supabaseUrl, anonKey);

    console.log("Attempting insert with ANON key (no auth)...");
    const { error } = await anonClient.from('households').insert({ display_name: 'Hack Attempt' });

    if (error) {
        console.log("Insert failed as expected:", error.message);
        if (error.message.includes('polic')) {
            console.log("Policy restriction confirmed.");
        }
    } else {
        console.log("WARNING: Insert SUCCEEDED with Anon key! RLS might be disabled or permissive.");
    }
}

checkPolicies();
