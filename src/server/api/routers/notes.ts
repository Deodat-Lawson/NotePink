import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  // Create a new note
  create: publicProcedure
    .input(
      z.object({
        user: z.number(),
        title: z.string().optional().default(""),
        content: z.string().optional().default(""),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({
        data: {
          user: { connect: { id: input.user } },
          title: input.title,
          content: input.content,
        },
      });
    }),

  // Get latest notes for a user
  getLatest: publicProcedure
    .input(
      z.object({
        user: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const notes = await ctx.db.note.findMany({
        where: { userId: input.user },
        orderBy: { createdAt: "desc" },
      });
      return notes; // returns an array of notes
    }),

  // Update an existing note
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),



});
