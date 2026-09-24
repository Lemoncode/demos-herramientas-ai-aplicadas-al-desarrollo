export interface Post {
  slug: string
  title: string
  excerpt: string
}

export const posts: Post[] = [
  {
    slug: 'shipping-fast',
    title: 'Shipping fast without breaking things',
    excerpt: 'A short field guide to keeping velocity high while your test suite stays honest.',
  },
  {
    slug: 'design-tokens',
    title: 'Design tokens you will not regret',
    excerpt: 'Why a small set of named tokens beats a thousand magic numbers.',
  },
  {
    slug: 'islands',
    title: 'Islands, explained',
    excerpt: 'What partial hydration actually buys you, and when it buys you nothing.',
  },
]
