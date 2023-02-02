import React from "react";

import { getLeagues, getSchedule } from "../../utils/lolesports";
import type { Event as GameEvent } from "../../types/scheduleType";
import type { League as League } from "../../types/scheduleType";
import { useEffect, useState } from "react";

import ScheduleCard from "./GameCards/ScheduleCard";
import ScheduleCardSkeleton from "./GameCards/ScheduleCardSkeleton";

export default function Schedule() {
  const [cardsToShow, setCardsToShow] = useState<number>(8);

  const [weekEvents, setWeekEvents] = useState<GameEvent[]>([]);

  const [leagues, setLeagues] = useState<League[]>([]);
  const targetLeagues = ["lcs", "cblol-brazil"];
  function findLeagueBySlug(slug: string) {
    return leagues.filter(function (x: { slug: string }) {
      return x.slug == slug;
    });
  }

  useEffect(() => {
    getLeagues(targetLeagues)
      .then((response: { leagues: Array<League>; leagueIds: string }) => {
        setLeagues(response.leagues);

        // Get Schedule
        void getSchedule(undefined, response.leagueIds).then(
          (response: {
            data: { data: { schedule: { events: object[] } } };
          }) => {
            setWeekEvents(
              response.data.data.schedule.events
                .filter(filterByThisWeek)
                .filter((event) => event.state == "unstarted")
            );
          }
        );
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Cardzada */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-3 2xl:grid-cols-4">
        {weekEvents.length == 0 &&
          Array.from(Array(8).keys()).map((index) => (
            <ScheduleCardSkeleton key={index} />
          ))}
        {weekEvents.length > 0 &&
          weekEvents.map(
            (event, index) =>
              index < cardsToShow && (
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                <ScheduleCard
                  key={event.match.id}
                  event={event}
                  league={findLeagueBySlug(event.league.slug)[0]!}
                />
              )
          )}
      </div>

      {/* Mostrar mais - simples */}
      <div
        className={
          weekEvents.length > 0 && cardsToShow < weekEvents.length
            ? "mt-7 h-2 w-full text-center shadow"
            : "hidden"
        }
      >
        <button
          className="relative -top-2 rounded-md bg-zinc-500/50 py-2 px-3 text-sm font-semibold text-white outline outline-1 outline-zinc-500 transition-all hover:bg-zinc-500/75"
          onClick={() => setCardsToShow(cardsToShow + 8)}
        >
          Ver mais jogos
        </button>
      </div>
    </div>
  );
}

function filterByThisWeek(event: GameEvent) {
  const eventDate = event.startTime.toString().split("T")[0]?.split("-");
  const isDateInThisWeek = function (date: Date) {
    const todayObj = new Date();
    const todayDate = todayObj.getDate();
    const todayDay = todayObj.getDay();

    // get first date of week
    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

    // first date of >>next<< week
    const firstDayOfNextWeek = new Date(firstDayOfWeek);
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 7);

    // if date is equal or within the first and last dates of the week
    return date >= firstDayOfWeek && date <= firstDayOfNextWeek;
  };

  if (isDateInThisWeek(new Date(eventDate))) {
    if (event.match === undefined || event.match.id === undefined) return false;
    return true;
  } else {
    return false;
  }
}
