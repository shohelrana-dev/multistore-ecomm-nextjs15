import { z } from 'zod'

export const emailValidation = z
    .string()
    .min(1, { message: 'Please enter email' })
    .email({ message: 'Email is invalid' })

export const passwordValidation = z
    .string()
    .min(1, { message: 'Please enter password' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(30, { message: 'Password must be at most 30 characters' })

export const signupSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Please enter your name' })
        .max(20, { message: 'Name must be at most 20 characters' }),
    email: emailValidation,
    password: passwordValidation,
})

export const emailVerificationSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    code: z
        .string()
        .min(1, { message: 'Please enter verification code' })
        .min(6, { message: 'Verification code must be 6 characters' })
        .max(6, { message: 'Verification code must be 6 characters' }),
})

export const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
})

export const resetPasswordSchema = z
    .object({
        password: passwordValidation,
        confirmPassword: z.string().min(1, { message: 'Please enter confirm password' }),
        token: z.string().min(1, { message: 'Token is required' }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: "Passwords didn't match",
                path: ['confirmPassword'],
            })
        }
    })

export const storeSchema = z.object({
    name: z.string().min(1, { message: 'Please enter store name' }),
    location: z.string().min(1, 'Please enter location'),
})

export const billboardSchema = z.object({
    title: z.string().min(1, 'Please enter billboard title'),
    image: z.string().min(1, 'Please upload billboard image'),
})

export const categorySchema = z.object({
    name: z.string().min(1, 'Please enter category name'),
    billboardId: z.string().min(1, 'Please select billboard'),
})

export const sizeSchema = z.object({
    name: z.string().min(1, 'Please enter size name'),
    value: z.string().min(1, 'Please enter size value'),
})

export const colorSchema = z.object({
    name: z.string().min(1, 'Please enter color name'),
    value: z
        .string()
        .min(1, 'Please enter color value')
        .regex(/^#([A-Fa-f0-9]{6})$/, { message: 'Color value is invalid' }),
})

export const productSchema = z.object({
    name: z.string().min(1, 'Please enter product name'),
    description: z.string().min(1, 'Please enter product description'),
    shortDescription: z.string().min(1, 'Please enter product short description'),
    price: z.number().min(1, 'Please enter product price'),
    discountPrice: z.number().optional(),
    thumbnail: z.string().min(1, 'Please upload product thumbnail'),
    images: z.array(z.object({ url: z.string() })).optional(),
    stock: z.number().min(1, 'Please enter product stock'),
    slug: z.string().min(1, 'Product slug is required'),
    featured: z.boolean().default(false).optional(),
    archived: z.boolean().default(false).optional(),
    status: z.enum(['in_stock', 'out_of_stock', 'preorder']).optional(),
    categoryId: z.number().optional(),
    sizeId: z.number().optional(),
    colorId: z.number().optional(),
    storeId: z.number().min(1, 'Store id is required'),
})

export type SignupFromValues = z.infer<typeof signupSchema>
export type EmailVerificationFromValues = z.infer<typeof emailVerificationSchema>
export type LoginFromValues = z.infer<typeof loginSchema>
export type ResetPasswordFromValues = z.infer<typeof resetPasswordSchema>
export type StoreFromValues = z.infer<typeof storeSchema>
export type BillboardFromValues = z.infer<typeof billboardSchema>
export type CategoryFromValues = z.infer<typeof categorySchema>
export type SizeFromValues = z.infer<typeof sizeSchema>
export type ColorFromValues = z.infer<typeof colorSchema>
export type ProductFromValues = z.infer<typeof productSchema>
