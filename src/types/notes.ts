
// types/notes.ts

export interface Note {
  id: number;
  title: string;
  content: string;
}

/**
 * If you like being explicit, you can create a separate type
 * or simply note that `selectedNote` can be `Note | null`.
 */
export type SelectedNote = Note | null;
