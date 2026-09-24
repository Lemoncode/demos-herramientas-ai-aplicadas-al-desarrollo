import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { Footer } from './components/Footer.tsx'
import { PostCard } from './components/PostCard.tsx'
import { posts } from './data/posts.ts'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="The Acme Blog"
          subtitle="Notes on shipping software to production."
        />
        <section className="post-list" aria-labelledby="post-list-heading">
          <h2 id="post-list-heading">Latest posts</h2>
          <div className="post-list__grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
