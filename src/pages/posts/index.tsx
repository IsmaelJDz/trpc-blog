import Link from 'next/link';
import { trpc } from '../../utils/trpc';

function PostListingPage() {
  const { data, isLoading } = trpc.useQuery(['posts.posts']);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Posts</h1>
      {data?.map(post => (
        <article key={post.id}>
          <h1>{post.title}</h1>
          <Link href={`/posts/${post.id}`}>Read more</Link>
        </article>
      ))}
    </div>
  );
}

export default PostListingPage;
