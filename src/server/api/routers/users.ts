// src/server/api/routers/user.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({

  get: publicProcedure
    .input(z.object({ clerkUserId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: input.clerkUserId }
      });
      return user ?? null;
    }),

  create: publicProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
        email: z.string().email(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Check if user already exists by clerkUserId (or by email)
      const existing = await ctx.db.user.findUnique({
        where: { clerkUserId: input.clerkUserId },
      });
      if (existing) {
        return existing;
      }
      // 2. Create new user
      const user = await ctx.db.user.create({
        data: {
          clerkUserId: input.clerkUserId,
          email: input.email,
          name: input.name,
        },
      });
      return user;
    }),






  // e.g. getWithNotes
  getWithNotes: publicProcedure
    .input(z.object({ clerkUserId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: input.clerkUserId },
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return user ?? null;
    }),



  getWithNotesChronological: publicProcedure
    .input(z.object({ clerkUserId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: input.clerkUserId },
        include: {
          notes: {
            orderBy: { updatedAt: "desc" },
          },
        },
      });
      return user ?? null;
    }),


  // create a new note
  addNote: publicProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
        title: z.string().optional().default(""),
        content: z.string().optional().default(""),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: input.clerkUserId },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.note.create({
        data: {
          userId: user.id,
          title: input.title,
          content: input.content,
        },
      });
    }),

  // update an existing note
  updateNote: publicProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
        noteId: z.number(),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // verify user and note ownership
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: input.clerkUserId },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const note = await ctx.db.note.findUnique({
        where: { id: input.noteId },
      });
      if (!note || note.userId !== user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.note.update({
        where: { id: input.noteId },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),

  // delete a note
  deleteNote: publicProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
        noteId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // verify user and note ownership
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: input.clerkUserId },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const note = await ctx.db.note.findUnique({
        where: { id: input.noteId },
      });
      if (!note || note.userId !== user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.note.delete({ where: { id: input.noteId } });
      return { success: true };
    }),
});
