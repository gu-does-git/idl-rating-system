import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const mainRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.count();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  postLeague: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.league.create({
          data: {
            name: input.name,
            slug: input.slug,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  removeLeague: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.league.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAllLeagues: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.league.findMany();
  }),
  postTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        image: z.string(),
        code: z.string(),
        leagueId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.team.create({
          data: {
            name: input.name,
            slug: input.slug,
            code: input.code,
            image: input.image,
            league: {
              connect: { id: input.leagueId },
            },
          },
          include: {
            league: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  removeTeam: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.team.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAllTeams: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany();
  }),
  postPlayer: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        image: z.string(),
        role: z.string(),
        nickName: z.string(),
        rating: z.number(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.player.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            image: input.image,
            role: input.role,
            nickName: input.nickName,
            rating: input.rating,
            team: {
              connect: { id: input.teamId },
            },
          },
          include: {
            team: true,
          },
        });

        // Update team avg rating
        try {
          const team = await ctx.prisma.team.findUnique({
            where: {
              id: input.teamId,
            },
            include: {
              Player: true,
            },
          });
          let rating = 0;
          team?.Player.forEach((player) => {
            rating += player.rating;
          });
          rating = rating / team?.Player.length;

          await ctx.prisma.team.update({
            where: { id: input.teamId },
            data: { avgRating: rating },
          });
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }),
  removePlayer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.player.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAllPlayers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.player.findMany();
  }),
});
