"use client";
import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { NotesSidebar } from "./NotesSidebar";
import { NotesEditor } from "./NotesEditor";
import type { Note } from "@prisma/client";
import { LogoutButton } from "~/app/notes/LogoutButton";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "~/styles/notes.module.css"
import { Search, Moon, Sun } from "lucide-react";



export default function NotesPage() {
  const { userId: clerkUserId } = useAuth();

  // 1. Fetch user + their notes in one go
  const { data: user, isLoading, isError } = api.users.getWithNotesChronological.useQuery(
    { clerkUserId: clerkUserId ?? "" },
    { enabled: !!clerkUserId }
  );

  // 2. Update + Delete mutations
  const utils = api.useContext();
  const updateNoteMutation = api.users.updateNote.useMutation({
    onSuccess: async () => {
      if (clerkUserId) {
        await utils.users.getWithNotesChronological.invalidate({ clerkUserId });
      }
    },
  });
  const deleteNoteMutation = api.users.deleteNote.useMutation({
    onSuccess: async () => {
      if (clerkUserId) {
        await utils.users.getWithNotesChronological.invalidate({ clerkUserId });
      }
      setSelectedNote(null);
      setIsEditing(false);
    },
  });

  // 3. Local state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  //search bar
  const [searchTerm, setSearchTerm] = useState("");

  // 4. When clicking a note from the sidebar
  const handleSelectNote = (note: Note) => {
    // If we are in the middle of editing another note, confirm discarding changes
    if (isEditing) {
      const discard = window.confirm("Discard unsaved changes?");
      if (!discard) return;
      setIsEditing(false);
    }
    setSelectedNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setUpdatedDate(note.updatedAt)
  };



  // 5. Start editing
  const handleEditStart = () => {
    setIsEditing(true);
  };

  // 6. Save changes
  const handleSave = () => {
    if (!selectedNote || !clerkUserId) return;
    updateNoteMutation.mutate({
      clerkUserId,
      noteId: selectedNote.id,
      title: editedTitle,
      content: editedContent,
    });

    // Update local state so UI is in sync
    setSelectedNote({
      ...selectedNote,
      title: editedTitle,
      content: editedContent,
    });

    setUpdatedDate(new Date().toISOString());
    setIsEditing(false);
  };

  // 7. Cancel editing
  const handleCancel = () => {
    if (!selectedNote) return;
    setEditedTitle(selectedNote.title);
    setEditedContent(selectedNote.content);
    setIsEditing(false);
  };

  // 8. Delete the selected note
  const handleDelete = () => {
    if (!selectedNote || !clerkUserId) return;
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;
    deleteNoteMutation.mutate({
      clerkUserId,
      noteId: selectedNote.id,
    });
  };

  // 9. Create note callback (used by the sidebar)
  const handleCreateNote = (note: Note) => {
    // Immediately select the note and switch to editing mode
    setSelectedNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setIsEditing(true);
  };



  const [theme, setTheme] = useState('light'); // could also be 'dark'

  const toggleTheme = () =>
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));


  // 10. Loading/error states
  if (isLoading || isError || !user) return <div className="p-4">Loading user & notes...</div>;

  // 11. Render
  return (
    <div data-theme={theme}>
      <div className={styles.container}>
        <NotesSidebar
          notes={user.notes ?? []}
          selectedNoteId={selectedNote?.id}
          clerkUserId={clerkUserId ?? ""}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote} // Pass down the callback
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className={styles.mainContent}>
          <header className={styles.header}>
            <h1 className={styles.headerTitle}>NotePink</h1>
            <button
              onClick={toggleTheme}
              className={styles.themeToggleButton}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>
            <LogoutButton />
          </header>

          <NotesEditor
            selectedNote={selectedNote}
            isEditing={isEditing}
            editedTitle={editedTitle}
            editedContent={editedContent}
            updatedAt={updatedDate}
            onStartEdit={handleEditStart}
            onChangeTitle={setEditedTitle}
            onChangeContent={setEditedContent}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
