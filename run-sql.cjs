const fs = require('fs')

const URL = 'https://jssqoalxnmkpmogouypy.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4ODAwNywiZXhwIjoyMDk2NjY0MDA3fQ.e1jKs3C-DigkwMqkk0-8gaQwBs_MEAOasHVOU9lJ7ek'

async function sql(query) {
  const resp = await fetch(`${URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': KEY, 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({ query })
  })
  const text = await resp.text()
  if (!resp.ok) console.log(`[${resp.status}] ${text.substring(0,200)}`)
  else console.log(`OK: ${query.substring(0,60)}...`)
}

async function run() {
  // Read the DATA_MODEL.md and extract SQL
  const md = fs.readFileSync('./docs/05-DATA_MODEL.md', 'utf8')
  const blocks = []
  const re = /```sql\n([\s\S]*?)```/g
  let m
  while ((m = re.exec(md)) !== null) blocks.push(m[1])

  for (const block of blocks) {
    const stmts = block.split(/;\s*\n/).map(s => s.trim()).filter(s => s && !s.startsWith('--'))
    for (const stmt of stmts) {
      const q = stmt.replace(/;\s*$/, '').trim()
      if (!q) continue
      await sql(q + ';')
    }
  }
  console.log('Done.')
}

run().catch(console.error)
