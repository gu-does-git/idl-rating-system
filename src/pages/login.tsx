import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const { data: sessionData, status: sessionStatus } = useSession();

  return (
    sessionStatus != "loading" && (
      <div className="text-white">
        {sessionData ? (
          "Usuário já logado"
        ) : (
          <button
            className="rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn()}
          >
            Entrar
          </button>
        )}
      </div>
    )
  );
}
