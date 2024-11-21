import 'dotenv/config'

import { config } from 'dotenv'
import { sql } from 'drizzle-orm'
import { db } from './index'

config({ path: '.env.local' })

async function main() {
    const tablesSchema = db._.schema
    if (!tablesSchema) throw new Error('Schema not loaded')

    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`))

    await db.execute(sql.raw(`DROP SCHEMA public CASCADE;`))
    await db.execute(sql.raw(`CREATE SCHEMA public;`))
    await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO postgres;`))
    await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO public;`))
    await db.execute(sql.raw(`COMMENT ON SCHEMA public IS 'standard public schema';`))
}

main()
