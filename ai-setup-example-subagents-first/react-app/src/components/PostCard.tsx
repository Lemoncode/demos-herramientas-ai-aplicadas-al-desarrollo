import type { Post } from '../data/posts.ts'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <h3 className="post-card__title">
        <a href={`/blog/${post.slug}`}>{post.title}</a>
      </h3>
      <p className="post-card__excerpt">{post.excerpt}</p>
    </article>
  )
}
