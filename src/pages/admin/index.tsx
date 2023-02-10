import Link from "next/link";
import React from "react";
import Breadcrumb from "../components/Breadcrumb";

export default function AdminIndex() {
  const breadcrumb = [
    { link: "/", name: "Início" },
    { link: "#", name: "Administração" },
  ];
  return (
    <>
      <Breadcrumb items={breadcrumb} />

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem] md:text-[5rem]">
          Fluxos do <span className="text-[#6CCE9A]">Site</span>
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { link: "/admin/ligas", title: "Informações das Ligas" },
            { link: "/admin/ratings", title: "Informações dos Ratings" },
          ].map((fluxo, index) => (
            <Link key={index} href={fluxo.link}>
              <div className="group flex h-24 w-48 max-w-xs cursor-pointer flex-col justify-center gap-4 rounded-xl bg-white/10 p-4 text-center text-white transition-all hover:bg-white/20">
                <h3 className="text-2xl text-white">{fluxo.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
