import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every folder in src/weeks/ that contains an index.mdx is one week.
// The _template folder is skipped on purpose.
const weeks = defineCollection({
  loader: glob({ pattern: ['*/index.mdx', '!_template/**'], base: './src/weeks' }),
  schema: z.object({
    title: z.string(),
    week: z.number().int().min(1).max(14),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string().default(''),
    // drafts are visible while running `npm run dev`, hidden in the deployed build
    status: z.enum(['draft', 'posted']).default('posted'),
  }),
});

export const collections = { weeks };
