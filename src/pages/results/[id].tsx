import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Results() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const result = api.group.getResult.useQuery(router.query.id!.toString());

  return (
    <>
      <Head>
        <title>Miguis</title>
        <meta name="description" content="Amigue Secrete" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-end">
        <div className="flex w-full justify-between border-b-2 p-2 px-10">
          <div className="content-center items-center">
            <h1>Migis</h1>
          </div>
          <div>
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <UserButton />}
          </div>
        </div>
      </header>

      <main className="flex h-screen justify-center">
        <div className="flex h-full w-full content-center items-center justify-center border-x border-slate-400 md:max-w-4xl">
          <h1>{result.data?.name}</h1>
          <h2>Seu Migi é{result.data?.pick}</h2>
        </div>
      </main>
    </>
  );
}
