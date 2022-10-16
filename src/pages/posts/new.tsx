import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { createPostInput } from '../../schema/post.schema';
import { trpc } from '../../utils/trpc';

function CreatePostPage() {
  const { handleSubmit, register } = useForm<createPostInput>();
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(['posts.create-post'], {
    onSuccess: ({ id }) => {
      router.push(`/posts/${id}`);
    },
  });

  function onSubmit(values: createPostInput) {
    mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div>{error.message}</div>}
      <input
        type='text'
        placeholder='Your post title'
        {...register('title')}
      />
      <textarea
        placeholder='your description'
        {...register('body')}
      />
      <button type='submit'>Create post</button>
    </form>
  );
}

export default CreatePostPage;
