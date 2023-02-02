import type { NextPage } from "next";
import React from "react";
import moment from "moment";
import Image from "next/image";

import type { League as League } from "../../../types/scheduleType";
import type { Event as Event } from "../../../types/scheduleType";

interface Props {
  event: Event;
  league: League;
}

const ScheduleCard: NextPage<Props> = (props) => {
  const event = props.event;
  const league = props.league;

  function toFirstUpperCase(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  return (
    <div className="group flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white transition-all hover:bg-white/20">
      <div className="relative z-0 flex flex-row justify-evenly">
        {/* PING de coisa importante */}
        <span className="absolute -right-6 -top-6 inline-flex hidden h-6 w-6 animate-ping rounded-full bg-green-400 opacity-75"></span>

        {/* Time 1 */}
        <div className="h-full w-28">
          <Image
            className="mx-auto drop-shadow"
            src={event.match.teams[0]?.image}
            alt={event.match.teams[0]?.name + " Logo"}
            width={16*6}
            height={16*6}
          />
          <div className="text-1xl flex h-12 min-w-full items-center justify-center overflow-hidden text-clip px-1 text-center font-medium text-white">
            <span>{event.match.teams[0]?.name}</span>
          </div>
        </div>

        {/* League background */}
        <div className="pointer-events-none absolute -z-50 flex h-full w-full flex-col items-center justify-center">
        <Image
            className="mx-auto my-auto h-auto w-40 rotate-12 opacity-75 drop-shadow"
            src={league.image}
            alt={league.name + " Logo"}
            width={16*5}
            height={16*5}
          />
        </div>

        {/* data */}
        <div className="flex h-full w-20 flex-col justify-center text-center">
          <h3 className="text-md text-center font-extralight text-white/75">
            <span>
              {toFirstUpperCase(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                moment(event.startTime).format("dddd").split("-")[0]!
              )}
            </span>
          </h3>
        </div>

        {/* Time 2 */}
        <div className="h-full w-28">
        <Image
            className="mx-auto drop-shadow"
            src={event.match.teams[1]?.image}
            alt={event.match.teams[1]?.name + " Logo"}
            width={16*6}
            height={16*6}
          />
          <div className="text-1xl flex h-12 min-w-full items-center justify-center overflow-hidden text-clip px-1 text-center font-medium text-white">
            <span>{event.match.teams[1]?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleCard;
