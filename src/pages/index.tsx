import { api } from "../utils/api";

// Imports
import Schedule from "./components/Schedule";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { type NextPage } from "next";
const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.main.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const hello = api.main.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Ilha das Lendas</title>
      </Head>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem] md:text-[5rem]">
          Jogos da <span className="text-[#6CCE9A]">Semana</span>
        </h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
            {secretMessage && <span> - {secretMessage}</span>}
          </p>
        </div>
        <Schedule />
      </div>
    </>
  );
};

export default Home;
