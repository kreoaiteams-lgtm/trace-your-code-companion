import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdzhnlmeiicyypbolffr.supabase.co'
const supabaseKey = 'sb_publishable_KLH7PMOPFlPJM5GeRHVwrQ_CTdrntkg'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('sessions').select('*').limit(1)
  console.log("Sessions table:", { data, error })
  
  const { data: d2, error: e2 } = await supabase.from('users').select('*').limit(1)
  console.log("Users table:", { data: d2, error: e2 })
}

test()
