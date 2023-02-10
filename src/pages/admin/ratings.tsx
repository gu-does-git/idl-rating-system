import React from "react";
import Breadcrumb from "../components/Breadcrumb";

export default function ratings() {
  const breadcrumb = [
    { link: "/", name: "Início" },
    { link: "/admin", name: "Administração" },
    { link: "#", name: "Informações dos Ratings" },
  ];
  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <div>ratings</div>
    </>
  );
}
