import React from "react";

export default function ScheduleCardSkeleton() {
  return (
    <div className="flex max-w-xs animate-pulse cursor-pointer flex-row gap-4 rounded-xl bg-white/10 p-4 text-white transition-all hover:bg-white/20">
      {/* Card de Time */}
      <div className="h-full w-28">
        <div className="mx-auto h-24 w-24  rounded-full bg-slate-200/50"></div>

        <div className="text-1xl flex h-12 min-w-full flex-col items-center justify-evenly overflow-hidden text-clip px-1 text-center font-medium text-white">
          <div className="h-2 w-16 rounded bg-slate-200/50"></div>
          <div className="h-2 w-24 rounded bg-slate-200/50"></div>
        </div>
      </div>

      {/* data */}
      <div className="flex h-full w-20 flex-col justify-center">
        <div className="h-2 w-5 mx-auto rounded bg-slate-200/50"></div>
      </div>

      {/* Card de Time */}
      <div className="h-full w-28">
        <div className="mx-auto h-24 w-24  rounded-full bg-slate-200/50"></div>

        <div className="text-1xl flex h-12 min-w-full flex-col items-center justify-evenly overflow-hidden text-clip px-1 text-center font-medium text-white">
          <div className="h-2 w-16 rounded bg-slate-200/50"></div>
          <div className="h-2 w-24 rounded bg-slate-200/50"></div>
        </div>
      </div>
    </div>
  );
}
