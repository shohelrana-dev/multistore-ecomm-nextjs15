import { relations } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { categoriesTable } from './categories.table'
import { colorsTable } from './colors.table'
import { Image, imagesTable } from './images.table'
import { sizesTable } from './sizes.table'
import { storesTable } from './stores.table'

export const stockStatusEnum = pgEnum('status', ['in_stock', 'out_of_stock', 'preorder'])
export type StockStatusEnum = 'in_stock' | 'out_of_stock' | 'preorder'

export const productsTable = pgTable('products', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id')
        .references(() => storesTable.id, { onDelete: 'cascade' })
        .notNull(),
    categoryId: integer('category_id').references(() => categoriesTable.id),
    sizeId: integer('size_id').references(() => sizesTable.id),
    colorId: integer('color_id').references(() => colorsTable.id),
    name: text('name').notNull(),
    description: text('description').notNull(),
    shortDescription: text('short_description').notNull(),
    thumbnail: text('thumbnail').notNull(),
    featured: boolean('featured').notNull().default(false),
    archived: boolean('archived').notNull().default(false),
    slug: text('slug').unique().notNull(),
    status: stockStatusEnum('status').notNull().default('out_of_stock'),
    ...dateColumns,
})

export const productsRelations = relations(productsTable, ({ many, one }) => ({
    store: one(storesTable, {
        fields: [productsTable.storeId],
        references: [storesTable.id],
    }),
    images: many(imagesTable),
}))

export type Product = (typeof productsTable.$inferSelect & { images: Image[] | null }) | undefined
