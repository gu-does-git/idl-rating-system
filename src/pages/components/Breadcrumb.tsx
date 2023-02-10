import Link from "next/link";
type Breadcrumb = {
  link: string;
  name: string;
};
interface Props {
  items: Array<Breadcrumb>;
}
export default function Breadcrumb({ items }: Props) {
  return (
    <>
      <div className="absolute top-20 mx-5 w-max text-left">
        <nav aria-label="breadcrumb">
          <ol className="flex w-full flex-wrap items-center rounded-md bg-white/30 bg-opacity-60 py-2 px-4">
            {items.map((item, index) => (
              <li
                key={index}
                className="text-white flex cursor-pointer items-center font-sans text-sm font-normal transition-colors group"
              >
                <Link href={item.link} className="px-2 transition-colors hover:bg-purple-500/50 rounded-full hover:text-white">
                  <span>{item.name}</span>
                </Link>
                {index + 1 != items.length && (
                  <span className="text-gray-100 pointer-events-none mx-2 select-none font-sans text-sm font-normal leading-normal antialiased">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </>
  );
}
