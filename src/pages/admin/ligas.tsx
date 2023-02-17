import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

import { getLeagues, getSchedule, getTeams } from "../../utils/lolesports";

import * as Tabs from "@radix-ui/react-tabs";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";

import type { Team } from "../../types/scheduleType";
import type { Event, Player } from "../../types/liveGameTypes";

export default function Ligas() {
  const breadcrumb = [
    { link: "/", name: "Início" },
    { link: "/admin", name: "Administração" },
    { link: "#", name: "Informações das Ligas" },
  ];

  // -------------------
  // STATES
  const [leagues, setLeagues] = useState<
    { code: string; id: string; slug: string; name: string }[]
  >([]);
  const [activeLeague, setActiveLeague] = useState<{
    code: string;
    id: string;
    slug: string;
    name: string;
  }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<{slug: string; code: string; players: Player[];}>();
  const [players, setPlayers] = useState<Player[]>([]);
  const { status } = useSession();

  // -------------------
  // VARS
  const targetLeagues = [
    "lcs",
    "cblol-brazil",
    "cblol_academy",
    "lck",
    "lpl",
    "lec",
  ];
  const tabsCss = {
    list: "mx-auto flex w-max flex-wrap items-center rounded-md bg-white/30 bg-opacity-60 py-2 px-4",
    trigger:
      "rounded-md py-2 px-6 text-white transition-all data-[state=active]:bg-white data-[state=active]:text-slate-600",
    content: "mt-5 bg-opacity-60 text-white data-[state=inactive]:hidden",
  };

  // -------------------
  // API STUFF
  const dbLeagues = api.main.getAllLeagues.useQuery();
  const dbTeams = api.main.getAllTeams.useQuery();
  const dbPlayers = api.main.getAllPlayers.useQuery();

  const utils = api.useContext();
  const postLeague = api.main.postLeague.useMutation({
    onMutate: async (newEntry) => {
      await utils.main.getAllLeagues.cancel();
      utils.main.getAllLeagues.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await utils.main.getAllLeagues.invalidate();
    },
  });
  const delLeague = api.main.removeLeague.useMutation({
    onMutate: async (newEntry) => {
      await utils.main.getAllLeagues.cancel();
      utils.main.getAllLeagues.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await utils.main.getAllLeagues.invalidate();
    },
  });
  const getEsportsTeams = function (league: {
    id: string;
    slug: string;
    name: string;
  }) {
    const targetLeague = leagues.find((o) => o.slug == league.slug);

    getSchedule(undefined, targetLeague?.id)
      .then(function (response: {
        data: { data: { schedule: { events: Array<Event> } } };
      }) {
        const tempTeams: Array<Team> = [];

        response.data.data.schedule.events.forEach((event) => {
          event.match.teams.forEach((team) => {
            if (!tempTeams?.find((o) => o.code == team.code))
              tempTeams.push(team);
          });
        });

        if (tempTeams.length > 0)
          setTeams(tempTeams.sort((a, b) => a.name.localeCompare(b.name)));
        setActiveLeague(targetLeague);
      })
      .catch(function (e: Error) {
        console.error(e);
      });
  };
  const postTeam = api.main.postTeam.useMutation({
    onMutate: async (newEntry) => {
      await utils.main.getAllTeams.cancel();
      utils.main.getAllTeams.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await utils.main.getAllTeams.invalidate();
    },
  });
  const createTeamSlug = function (teamName: string) {
    if (teamName.split(" ").length > 2) {
      const tempName = teamName.split(" ");
      tempName.pop();
      teamName = tempName.join(" ");
    }
    return teamName
      .toLowerCase()
      .replace(/[^A-Za-z\s]+/g, "")
      .replaceAll(" ", "-");
  };
  const delTeam = api.main.removeTeam.useMutation({
    onMutate: async (newEntry) => {
      await utils.main.getAllTeams.cancel();
      utils.main.getAllTeams.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await utils.main.getAllTeams.invalidate();
    },
  });
  const getTeamPlayers = function (team: { slug: string }) {
    getTeams(team.slug).then(function (response: {
      data: { data: { teams: Array<{ code: string; slug: string; players: Array<Player> }> } };
    }) {
      const teams = response.data.data.teams;
      const team = teams[0];
      if (team) setPlayers(team?.players);
      if (team) setActiveTeam(team);
    }).catch((e) => console.error(e));
  };
  const postPlayer = api.main.postPlayer.useMutation({
    onMutate: async (newEntry) => {
      await utils.main.getAllPlayers.cancel();
      utils.main.getAllPlayers.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await utils.main.getAllPlayers.invalidate();
    },
  });
  const delPlayer = api.main.removePlayer.useMutation({
    onMutate: async (newEntry) => {
      await utils.main.getAllPlayers.cancel();
      utils.main.getAllPlayers.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await utils.main.getAllPlayers.invalidate();
    },
  });

  // -------------------
  // EFFECT
  useEffect(() => {
    setActiveLeague({
      code: "",
      id: "",
      slug: "",
      name: "",
    });
    setActiveTeam({
      code: "",
      slug: "",
      players: []
    });
    setTeams([]);
    setPlayers([]);
    getLeagues(targetLeagues)
      .then(
        (response: {
          leagues: Array<{
            code: string;
            id: string;
            slug: string;
            name: string;
          }>;
          filteredLeagues: Array<{
            code: string;
            id: string;
            slug: string;
            name: string;
          }>;
          leagueIds: string;
        }) => {
          setLeagues(response.filteredLeagues);
        }
      )
      .catch((error) => console.error(error));
  }, []);

  if (status !== "authenticated") return null;
  else if (status == "authenticated")
    return (
      <>
        <Breadcrumb items={breadcrumb} />

        <Tabs.Root className="mx-5 w-full" defaultValue="tab1">
          <Tabs.List
            className={tabsCss.list}
            aria-label="Administração das ligas"
          >
            <Tabs.Trigger className={tabsCss.trigger} value="tab1">
              <span className="">Ligas</span>
            </Tabs.Trigger>
            <Tabs.Trigger className={tabsCss.trigger} value="tab2">
              <span className="">Times</span>
            </Tabs.Trigger>
            <Tabs.Trigger className={tabsCss.trigger} value="tab3">
              <span className="">Jogadores</span>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content className={tabsCss.content} value="tab1">
            <div className="mx-5 flex flex-col flex-wrap items-center justify-center rounded-md  bg-white/30 py-2 px-4">
              Ligas disponíveis:
              <ol className="my-5">
                {leagues.map((league, index) => (
                  <li key={index}>
                    {/* Botão de add */}
                    {!dbLeagues.data?.find((o) => o.slug === league.slug) && (
                      <button
                        onClick={() =>
                          postLeague.mutate({
                            name: league.name,
                            slug: league.slug,
                          })
                        }
                      >
                        <span>➕</span>
                      </button>
                    )}

                    {/* Botão de remover */}
                    {dbLeagues.data &&
                      dbLeagues.data?.find((o) => o.slug === league.slug) && (
                        <button
                          className="group"
                          onClick={() =>
                            delLeague.mutate({
                              id: dbLeagues.data?.find(
                                (o) => o.slug === league.slug
                              )?.id,
                            })
                          }
                        >
                          <span className="group-hover:hidden">✔️</span>
                          <span className="hidden group-hover:block">❌</span>
                        </button>
                      )}

                    <span className="ml-0.5">{league.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Tabs.Content>

          <Tabs.Content className={tabsCss.content} value="tab2">
            <div className="mx-5 flex flex-row flex-wrap items-center justify-center rounded-md  bg-white/30 py-2 px-4">
              <div className="mx-4">
                Selecione uma liga:
                <ol className="my-4">
                  {dbLeagues.data?.map((league, index) => (
                    <li
                      key={index}
                      className="py-1 text-center first:pt-0 last:pb-0"
                    >
                      <button
                        onClick={() =>
                          activeLeague?.slug != league.slug
                            ? getEsportsTeams(league)
                            : ""
                        }
                        className={
                          (activeLeague?.slug == league.slug
                            ? "bg-slate-500"
                            : "bg-slate-500/25") +
                          " rounded-md px-2 py-1 transition-colors hover:bg-slate-500"
                        }
                      >
                        {league.name}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <ul className="border-l border-white px-4">
                  {teams.map((team, index) => (
                    <li key={index}>
                      {/* Botão de add */}
                      {!dbTeams.data?.find((o) => o.code === team.code) && (
                        <button
                          onClick={() =>
                            postTeam.mutate({
                              name: team.name,
                              code: team.code,
                              image: team.image,
                              slug: createTeamSlug(team.name),
                              leagueId: dbLeagues.data?.find(
                                (o) => o.slug === activeLeague?.code
                              )?.id,
                            })
                          }
                        >
                          <span>➕</span>
                        </button>
                      )}

                      {/* Botão de remover */}
                      {dbTeams.data?.find((o) => o.code === team.code) && (
                        <button
                          className="group"
                          onClick={() =>
                            delTeam.mutate({
                              id: dbTeams.data?.find(
                                (o) => o.code === team.code
                              )?.id,
                            })
                          }
                        >
                          <span className="group-hover:hidden">✔️</span>
                          <span className="hidden group-hover:block">❌</span>
                        </button>
                      )}

                      <span className="ml-0.5">{team.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content className={tabsCss.content} value="tab3">
            <div className="mx-5 flex flex-row flex-wrap items-center justify-center rounded-md  bg-white/30 py-2 px-4">
              <div className="mx-4 text-center">
                Selecione um time:
                <ul className="my-4 flex items-center justify-center gap-2">
                  {dbTeams.data?.map((team, index) => (
                    <li key={index} className="text-center">
                      <button
                        onClick={() =>
                          activeTeam?.slug != team.slug
                            ? getTeamPlayers(team)
                            : ""
                        }
                        className={
                          (activeTeam?.slug == team.slug
                            ? "bg-slate-500"
                            : "bg-slate-500/25") +
                          " rounded-md px-2 py-1 transition-colors hover:bg-slate-500"
                        }
                      >
                        {team.name}
                      </button>
                    </li>
                  ))}
                </ul>
                <ul>
                  {players.map((player, index) => (
                    <li key={index}>
                      {/* Botão de add */}
                      {!dbPlayers.data?.find(
                        (o) => o.nickName === player.summonerName
                      ) && (
                        <button
                          onClick={() =>
                            postPlayer.mutate({
                              firstName: player.firstName,
                              lastName: player.lastName,
                              image: player.image,
                              role: player.role,
                              nickName: player.summonerName,
                              rating: 50,
                              teamId: dbTeams.data?.find(
                                (o) => o.code === activeTeam?.code
                              )?.id,
                            })
                          }
                        >
                          <span>➕</span>
                        </button>
                      )}

                      {/* Botão de remover */}
                      {dbPlayers.data?.find(
                        (o) => o.nickName === player.summonerName
                      ) && (
                        <button
                          className="group"
                          onClick={() =>
                            delPlayer.mutate({
                              id: dbPlayers.data?.find(
                                (o) => o.nickName === player.summonerName
                              )?.id,
                            })
                          }
                        >
                          <span className="group-hover:hidden">✔️</span>
                          <span className="hidden group-hover:block">❌</span>
                        </button>
                      )}

                      <span className="ml-0.5">{player.summonerName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </>
    );
}
