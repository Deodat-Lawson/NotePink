"use client";
import React from "react";
import type { Note } from "@prisma/client";
import { api } from "~/trpc/react";
import { Search, Moon, Sun } from "lucide-react";
import { getSnippetAroundMatch } from "~/app/notes/_components/snippetAroundText";
import { highlightTerm } from "~/app/notes/_components/highlightText";
import styles from "~/styles/notes.module.css";

type NotesSidebarProps = {
  notes: Note[];
  selectedNoteId?: number;
  onSelectNote: (note: Note) => void;
  onCreateNote: (note: Note) => void; // Callback to parent
  clerkUserId: string | null;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export function NotesSidebar({
                               notes,
                               selectedNoteId,
                               onSelectNote,
                               onCreateNote,
                               clerkUserId,
                               searchTerm,
                               setSearchTerm,
                             }: NotesSidebarProps) {
  const utils = api.useContext();

  // 1) Add Note mutation
  const addNoteMutation = api.users.addNote.useMutation({
    onSuccess: async (newNote) => {
      if (clerkUserId) {
        await utils.users.getWithNotesChronological.invalidate({ clerkUserId });
      }
      onCreateNote(newNote);
    },
  });

  // 2) Handler: create a new blank note
  const handleAddNote = () => {
    if (!clerkUserId) return;
    addNoteMutation.mutate({
      clerkUserId,
      title: "Enter your title here",
      content: "Enter your content here",
    });
  };

  const filteredNotes = React.useMemo(() => {
    if (!searchTerm) return notes;
    const lowerTerm = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerTerm) ||
        note.content.toLowerCase().includes(lowerTerm)
    );
  }, [notes, searchTerm]);

  return (
    <div className={styles.sidebar}>
      {/* Header container with My Notes and the theme toggle button */}
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>My Notes</h2>
      </div>

      <button onClick={handleAddNote} className={styles.addNoteButton}>
        Add New Note
      </button>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search documents..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.notesList}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => {
            const titleHighlighted = highlightTerm(note.title, searchTerm);
            const snippet = getSnippetAroundMatch(note.content, searchTerm, 50);
            return (
              <div
                key={note.id}
                className={
                  note.id === selectedNoteId ? styles.noteItemActive : styles.noteItem
                }
                onClick={() => onSelectNote(note)}
              >
                <div>{titleHighlighted}</div>
                {searchTerm && snippet && (
                  <div className={styles.snippetText}>
                    {highlightTerm(snippet, searchTerm)}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className={styles.emptyState}>No notes found.</p>
        )}
      </div>
    </div>
  );
}
