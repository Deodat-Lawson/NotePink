"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import Showdown from "showdown";
import styles from "~/styles/notes.module.css"


// Add or update your Tailwind/CSS modules with a class that hides the .mde-tabs
// For example, if you are using a global CSS file, place this there:
//
// .hidden-mde-tabs .mde-tabs {
//   display: none;
// }



type NotesEditorProps = {
    selectedNote: Note | null;
    isEditing: boolean;
    editedTitle: string;
    editedContent: string;
    onStartEdit: () => void;
    onChangeTitle: (val: string) => void;
    onChangeContent: (val: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
    updatedAt: string;
};

export function NotesEditor({
                                selectedNote,
                                isEditing,
                                editedTitle,
                                editedContent,
                                onStartEdit,
                                onChangeTitle,
                                onChangeContent,
                                onSave,
                                onCancel,
                                onDelete,
                                updatedAt,
                            }: NotesEditorProps) {
    const [useVisualEditor, setUseVisualEditor] = React.useState(true);
    const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write");

    // Memoize the Showdown converter
    const converter = React.useMemo(
        () =>
            new Showdown.Converter({
                tables: true,
                simplifiedAutoLink: true,
                strikethrough: true,
                tasklists: true,
                sanitize: false,
            }),
        []
    );

    if (!selectedNote) {
        return (
            <div className={styles.emptyStateContainer}>
                <p className={styles.emptyState}>
                    Select a note from the sidebar to view its contents.
                </p>
            </div>
        );
    }

    if (isEditing) {
        const writeButtonClass =
            selectedTab === "write"
                ? "text-pink-600 font-bold border-b-2 border-pink-600 px-4 py-2"
                : "text-gray-500 px-4 py-2";

        const previewButtonClass =
            selectedTab === "preview"
                ? "text-pink-600 font-bold border-b-2 border-pink-600 px-4 py-2"
                : "text-gray-500 px-4 py-2";

        return (
            <div className={styles.contentContainer}>
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => onChangeTitle(e.target.value)}
                    className={styles.editableTitle}
                />

                <div className="flex justify-end">
                    <button
                        onClick={() => setUseVisualEditor((prev) => !prev)}
                        className={styles.toggleButton}
                    >
                        {useVisualEditor ? "Switch to Raw Markdown" : "Switch to Visual Editor"}
                    </button>
                </div>

                {useVisualEditor ? (
                  <div className="w-full p-4 text-gray-700 border border-pink-100 rounded-lg focus:outline-none focus:border-pink-400 resize-none bg-white">
                    <ReactMde
                        value={editedContent}
                        onChange={onChangeContent}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={(markdown) =>
                            Promise.resolve(converter.makeHtml(markdown))
                        }
                        childProps={{
                            writeButton: {
                                className: writeButtonClass,
                            },
                            previewButton: {
                                className: previewButtonClass,
                            },
                        }}
                        />
                    </div>
                ) : (
                    <textarea
                        value={editedContent}
                        onChange={(e) => onChangeContent(e.target.value)}
                        className="w-full h-96 p-4 text-gray-700 border border-pink-100 rounded-lg focus:outline-none focus:border-pink-400 resize-none"
                        autoFocus
                    />
                )}

                <div className={styles.buttonContainer}>
                    <button onClick={onSave} className={styles.saveButton}>
                        Save Changes
                    </button>

                    <button onClick={onCancel} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // READ-ONLY MODE:
    // We lock ReactMde to "preview" and hide tabs & toolbar.
    return (
      <div className={styles.contentContainer}>
        <p className={styles.lastModified}>
          Last modified: {new Date(updatedAt).toLocaleString()}
        </p>

        <h2 className={styles.noteTitle} onClick={onStartEdit}>
          {selectedNote.title}
        </h2>

          <ReactMde
            // Hide the "Write" and "Preview" tabs:
            className={styles.hiddenMdeTabs}
            // Keep the note content in preview mode only:
            selectedTab="preview"
            onTabChange={() => {
            }}
            // This ensures no toolbar is rendered:
            toolbarCommands={[]}
            // Force minimal height so we don't see a text area:
            minEditorHeight={0}
            maxEditorHeight={-1}
            value={editedContent}
            onChange={onChangeContent}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(converter.makeHtml(markdown))
            }
        />


          <div className={styles.buttonContainer}>
            <button onClick={onStartEdit} className={styles.saveButton}>
              Edit
            </button>

            <button onClick={onDelete} className={styles.cancelButton}>
              Delete
            </button>
          </div>
        </div>
        );
        }
