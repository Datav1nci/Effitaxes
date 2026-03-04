"use client";

import React, { useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { recordDocuments, deleteDocument, DocumentMetadataInput } from "@/actions/uploadDocuments";

const ACCEPTED_TYPES = "image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FILES = 10;
const BUCKET = "user-documents";

interface DocumentRecord {
    id: string;
    file_name: string;
    storage_path: string;
    file_size: number | null;
    mime_type: string | null;
    label: string | null;
    uploaded_at: string;
}

interface PendingFile {
    id: string;
    file: File;
    label: string;
    error?: string;
}

interface DocumentUploadProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
    initialDocuments: DocumentRecord[];
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function getMimeIcon(mime: string | null): string {
    if (!mime) return "📄";
    if (mime === "application/pdf") return "📕";
    if (mime.startsWith("image/")) return "🖼️";
    if (mime.includes("excel") || mime.includes("spreadsheet") || mime === "text/csv") return "📊";
    return "📄";
}

function sanitizeName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default function DocumentUpload({ t, initialDocuments }: DocumentUploadProps) {
    const d = t.documents;

    const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [documentToDelete, setDocumentToDelete] = useState<DocumentRecord | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validate = (file: File): string | undefined => {
        if (file.size > MAX_FILE_SIZE) return d.errorSize;
        // Accept images + known document types
        if (file.type.startsWith("image/")) return undefined;
        const allowed = ["application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowed.includes(file.type)) return d.errorType;
    };

    const addFiles = useCallback((files: FileList | File[]) => {
        const arr = Array.from(files);
        const newFiles: PendingFile[] = arr.map(f => ({
            id: `${f.name}-${Date.now()}-${Math.random()}`,
            file: f,
            label: "",
            error: validate(f),
        }));
        setPendingFiles(prev => [...prev, ...newFiles].slice(0, MAX_FILES));
        setUploadSuccess(false);
        setUploadError(null);
        setPanelOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [d]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    const handleUpload = async () => {
        const valid = pendingFiles.filter(p => !p.error);
        if (!valid.length) return;
        setIsUploading(true);
        setUploadError(null);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Fetch user name for human-readable folder names
            const { data: profile } = await supabase
                .from("profiles")
                .select("first_name, last_name")
                .eq("id", user.id)
                .single();
            const folderName = profile
                ? `${sanitizeName(profile.first_name || "")}${sanitizeName(profile.last_name || "")}_${user.id}`
                : user.id;

            // 1. Upload each file directly to Supabase Storage from the browser
            const metadataList: DocumentMetadataInput[] = [];
            for (const p of valid) {
                const timestamp = Date.now();
                const storagePath = `${folderName}/${timestamp}_${sanitizeName(p.file.name)}`;

                const { error: uploadErr } = await supabase.storage
                    .from(BUCKET)
                    .upload(storagePath, p.file, {
                        contentType: p.file.type || "application/octet-stream",
                        upsert: false,
                    });

                if (uploadErr) {
                    throw new Error(`Failed to upload ${p.file.name}: ${uploadErr.message}`);
                }

                metadataList.push({
                    fileName: p.file.name,
                    mimeType: p.file.type || "application/octet-stream",
                    fileSize: p.file.size,
                    storagePath,
                    label: p.label || undefined,
                });
            }

            // 2. Record metadata + notify admin via a lightweight server action
            const result = await recordDocuments(metadataList);
            if (!result.success) {
                setUploadError(result.error || d.errorUpload);
                return;
            }

            setUploadSuccess(true);
            setPendingFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            const now = new Date().toISOString();

            let newDocs: DocumentRecord[] = [];
            if (result.documents && result.documents.length > 0) {
                newDocs = result.documents.map((row: any) => ({
                    id: row.id,
                    file_name: row.file_name,
                    storage_path: row.storage_path,
                    file_size: row.file_size,
                    mime_type: row.mime_type,
                    label: row.label,
                    uploaded_at: row.created_at || now,
                }));
            } else {
                newDocs = valid.map(p => ({
                    id: `temp-${Date.now()}-${Math.random()}`,
                    file_name: p.file.name,
                    storage_path: "",
                    file_size: p.file.size,
                    mime_type: p.file.type,
                    label: p.label || null,
                    uploaded_at: now,
                }));
            }

            setDocuments(prev => [...newDocs, ...prev]);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("Upload error:", msg);
            setUploadError(`${d.errorUpload} (${msg})`);
        } finally {
            setIsUploading(false);
        }
    };

    const requestDelete = (doc: DocumentRecord) => {
        setDeleteError(null);
        setDocumentToDelete(doc);
    };

    const confirmDelete = async () => {
        if (!documentToDelete) return;
        setDeletingId(documentToDelete.id);
        const result = await deleteDocument(documentToDelete.id, documentToDelete.storage_path);
        if (result.success) {
            setDocuments(prev => prev.filter(x => x.id !== documentToDelete.id));
            setDocumentToDelete(null);
        } else {
            setDeleteError(result.error || "Failed to delete document.");
        }
        setDeletingId(null);
    };

    const validCount = pendingFiles.filter(p => !p.error).length;

    return (
        <div className="w-full max-w-4xl mx-auto">

            {/* ── Section Header ── */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
                        <span className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm shadow-indigo-200">
                            📎
                        </span>
                        {d.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{d.subtitle}</p>
                </div>
                {documents.length > 0 && (
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-full border border-indigo-200 dark:border-indigo-700">
                        {documents.length}
                    </span>
                )}
            </div>

            {/* ── Drop Zone ── */}
            <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                    transition-all duration-300 select-none group
                    ${isDragOver
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/50 scale-[1.01]"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_TYPES}
                    onChange={e => e.target.files && addFiles(e.target.files)}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                    <div className={`relative transition-all duration-300 ${isDragOver ? "scale-125 -translate-y-1" : "group-hover:scale-105"}`}>
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/60 dark:to-purple-900/60 rounded-2xl flex items-center justify-center shadow-sm">
                            <svg className={`w-8 h-8 transition-colors duration-200 ${isDragOver ? "text-indigo-600" : "text-indigo-400 group-hover:text-indigo-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 4.5 4.5 0 0 1 3.067 7.875" />
                            </svg>
                        </div>
                        {isDragOver && (
                            <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 animate-ping opacity-40" />
                        )}
                    </div>
                    <div>
                        <p className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {d.dragDrop}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPEG, PNG, HEIC, Excel, CSV · max 15 MB · {d.maxFiles}</p>
                    </div>
                    <span className="mt-1 inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 dark:shadow-indigo-900 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {d.uploadBtn}
                    </span>
                </div>
            </div>

            {/* ── Pending File List ── */}
            {pendingFiles.length > 0 && (
                <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between px-0.5">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {pendingFiles.length} {d.selectedFiles}
                        </p>
                        {validCount > 0 && (
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                                {validCount} {d.readyToUpload}
                            </span>
                        )}
                    </div>

                    {pendingFiles.map(p => (
                        <div
                            key={p.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${p.error
                                ? "border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-800"
                                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60"
                                }`}
                        >
                            <span className="text-2xl flex-shrink-0">{getMimeIcon(p.file.type)}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.file.name}</p>
                                {p.error
                                    ? <p className="text-xs text-red-500 mt-0.5">{p.error}</p>
                                    : <p className="text-xs text-gray-400">{formatFileSize(p.file.size)}</p>
                                }
                            </div>
                            {!p.error && (
                                <input
                                    type="text"
                                    value={p.label}
                                    onChange={e => setPendingFiles(prev => prev.map(x => x.id === p.id ? { ...x, label: e.target.value } : x))}
                                    placeholder={d.labelPlaceholder}
                                    className="w-40 sm:w-52 px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => setPendingFiles(prev => prev.filter(x => x.id !== p.id))}
                                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    {/* Upload CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading || validCount === 0}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 dark:shadow-indigo-900 transition-all"
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    {d.uploading}
                                </>
                            ) : (
                                <><span>📤</span> {d.submitUpload}</>
                            )}
                        </button>
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">{d.notifyAdmin}</p>
                    </div>
                </div>
            )}

            {/* ── Feedback ── */}
            {uploadSuccess && (
                <div className="mt-4 flex items-center gap-2.5 p-3.5 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="text-lg">✅</span> {d.successUpload}
                </div>
            )}
            {uploadError && (
                <div className="mt-4 flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm animate-in fade-in duration-300">
                    <span className="text-lg">⚠️</span> {uploadError}
                </div>
            )}

            {/* ── Uploaded Documents ── */}
            <div className="mt-8">
                <button
                    type="button"
                    onClick={() => setPanelOpen(v => !v)}
                    className="w-full flex items-center justify-between py-3 group"
                >
                    <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                        </svg>
                        {d.title}
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full">
                            {documents.length}
                        </span>
                    </h3>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${panelOpen ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                {panelOpen && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        {documents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
                                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">{d.noDocuments}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {documents.map(doc => (
                                    <div
                                        key={doc.id}
                                        className="group flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
                                    >
                                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-gray-100 dark:border-gray-600">
                                            {getMimeIcon(doc.mime_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{doc.file_name}</p>
                                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5">
                                                {doc.label && (
                                                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-md">
                                                        {doc.label}
                                                    </span>
                                                )}
                                                {doc.file_size && (
                                                    <span className="text-xs text-gray-400">{formatFileSize(doc.file_size)}</span>
                                                )}
                                                <span className="text-xs text-gray-400">
                                                    {d.uploadedAt} {formatDate(doc.uploaded_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => requestDelete(doc)}
                                            disabled={deletingId === doc.id}
                                            className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all disabled:opacity-30"
                                            title={d.deleteBtn}
                                        >
                                            {deletingId === doc.id ? (
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Document Deletion Modal ── */}
            {documentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                                <span className="text-red-500">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </span>
                                {d.deleteConfirm}
                            </h3>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 break-words mb-4">
                                {documentToDelete.file_name}
                            </p>
                            {deleteError && (
                                <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-900">
                                    {deleteError}
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setDocumentToDelete(null); setDeleteError(null); }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors"
                                    disabled={deletingId === documentToDelete.id}
                                >
                                    {t.common.cancel}
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                                    disabled={deletingId === documentToDelete.id}
                                >
                                    {deletingId === documentToDelete.id ? (
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                    ) : (
                                        d.deleteBtn
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
