import { initializeApollo } from '@/src/lib/apollo';
import { useQuery } from '@apollo/client';
import { type NextPage } from 'next';
import Head from 'next/head';
import { GetAllUsersDocument } from '../generated/generated';
import { motion } from 'framer-motion';
import { Button } from '../components/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

/* 3 data fetching options in Next.js:
1. Client-side rendering - useQuery is called on client-side.
2. Static rendering - getStaticProps is called at build time on server-side.
3. Server-side rendering - getServersideProps is called on every request.
*/

const Home: NextPage = () => {
  // 1. Client side rendering example
  const results = useQuery(GetAllUsersDocument);
  const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>Incridea</title>
        <meta name="description" content="Official website for Incridea 2023" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen flex justify-center items-center flex-col gap-5">
        <div className="text-2xl border-b border-gray-400">
          Incridea &apos;23
        </div>

        <div className="text-center">
          {status === 'loading' && <div>Loading...</div>}
          {status === 'authenticated' && (
            <div>
              <div>Authenticated as {session?.user?.data.email}</div>
              <div>Session expires in {session?.expires}</div>
            </div>
          )}
          {status === 'unauthenticated' && <div>Not authenticated</div>}
          <div className="text-blue-500 mt-3">
            Apollo Client + Framer Motion Demo
          </div>
          <div className="flex flex-wrap justify-center gap-5 mt-5">
            {results.loading && <div>Loading...</div>}
            {results.data?.users.map((user) => (
              <motion.button
                // gesture animation example
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                // draggable example
                drag
                dragConstraints={{
                  top: -5,
                  bottom: 5,
                }}
                key={user.id}
                className="border border-gray-400 rounded-lg p-5 hover:bg-gray-50 hover:border-black"
              >
                <div>{user.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="text-blue-500 mt-3">
            class-variance-authority example
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {status === 'authenticated' ? (
              <Button
                onClick={() => {
                  signOut();
                }}
                intent="secondary"
                size="medium"
                className="rounded-xl mt-3 font-bold" // custom class
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    signIn();
                  }}
                  intent="primary"
                  size="small"
                  className="rounded-xl mt-3"
                >
                  Login
                </Button>
                <Button intent={'primary'} size={'small'} className="mt-3">
                  <Link href={'/auth/signup'}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

// 2. Static rendering example
export const getStaticProps = async () => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: GetAllUsersDocument,
  });
  return {
    props: { initialApolloState: apolloClient.cache.extract() },
    /* ISR: Incremental Static Regeneration
    for eg: revalidate: 1 means that if a new request comes in, then the page will be revalidated at most once every second.*/
  };
};

// 3. SSR: similaryl getServersideProps can be used instead of getStaticProps for SSR.