import Link from "next/link";
import React from "react";
import Image from "next/image";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: sessionData } = useSession();

  return (
    <div className="absolute flex h-16 w-full flex-row items-center justify-center px-3  leading-normal antialiased">
      <div className="grid auto-cols-fr grid-flow-col items-center gap-1 text-center font-light text-slate-100">
        <Link href="/">
          <span>Classificação de Times</span>
        </Link>
        <Link href="/login" className="mx-auto">
          <Image
            src="https://pbs.twimg.com/profile_images/1616459845950898178/ARvMQXLO_400x400.jpg"
            alt="Logo da Ilha das Lendas"
            width={16 * 3}
            height={16 * 3}
            className="rounded-full"
            placeholder="blur"
            blurDataURL="https://pbs.twimg.com/profile_images/1616459845950898178/ARvMQXLO_400x400.jpg"
          />
        </Link>
        <Link href="/">
          <span>Classificação de Jogadores</span>
        </Link>
      </div>
      <div className="absolute right-3">
        {sessionData && (
          <Link href="/admin">
            <button className="rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20">
              Administração
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
