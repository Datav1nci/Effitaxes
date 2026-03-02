"use client";

import React, { useState, useRef, useCallback } from "react";
import { uploadDocuments, UploadedDocumentInput } from "@/actions/uploadDocuments";

const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/heic",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
];
const ALLOWED_EXTENSIONS = "PDF, JPEG, PNG, HEIC, Excel, CSV";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FILES = 10;

interface PendingFile {
    id: string;
    file: File;
    label: string;
    error?: string;
}

interface StepDocumentsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
    onUploadComplete?: (uploaded: boolean) => void;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMimeIcon(type: string): string {
    if (type === "application/pdf") return "📕";
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("excel") || type.includes("spreadsheet") || type === "text/csv") return "📊";
    return "📄";
}

export function StepDocuments({ t, onUploadComplete }: StepDocumentsProps) {
    const d = t.documents;

    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedCount, setUploadedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validate = (file: File): string | undefined => {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) return d.errorType;
        if (file.size > MAX_FILE_SIZE) return d.errorSize;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [d]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res((r.result as string).split(",")[1]);
            r.onerror = rej;
            r.readAsDataURL(file);
        });

    const handleUpload = async () => {
        const valid = pendingFiles.filter(p => !p.error);
        if (!valid.length) return;
        setIsUploading(true);
        setUploadError(null);
        try {
            const inputs: UploadedDocumentInput[] = await Promise.all(
                valid.map(async p => ({
                    fileName: p.file.name,
                    mimeType: p.file.type,
                    fileSize: p.file.size,
                    label: p.label || undefined,
                    base64: await fileToBase64(p.file),
                }))
            );
            const result = await uploadDocuments(inputs);
            if (result.success) {
                setUploadSuccess(true);
                setUploadedCount(c => c + valid.length);
                setPendingFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = "";
                onUploadComplete?.(true);
            } else {
                setUploadError(result.error || d.errorUpload);
            }
        } catch {
            setUploadError(d.errorUpload);
        } finally {
            setIsUploading(false);
        }
    };

    const validCount = pendingFiles.filter(p => !p.error).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-2xl">📎</span> {d.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{d.enrollmentSubtitle}</p>
            </div>

            {/* Upload complete badge */}
            {uploadedCount > 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                            {uploadedCount} {d.selectedFiles} {d.successUpload}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">{d.canUploadMore}</p>
                    </div>
                </div>
            )}

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
                    transition-all duration-300 select-none
                    ${isDragOver
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-lg shadow-indigo-100 dark:shadow-indigo-900 scale-[1.01]"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_MIME_TYPES.join(",")}
                    onChange={e => e.target.files && addFiles(e.target.files)}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                    {/* Animated cloud icon */}
                    <div className={`relative transition-transform duration-300 ${isDragOver ? "scale-125 -translate-y-1" : ""}`}>
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl flex items-center justify-center shadow-sm">
                            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 4.5 4.5 0 0 1 3.067 7.875" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-gray-700 dark:text-gray-300">{d.dragDrop}</p>
                        <p className="text-xs text-gray-400 mt-1">{ALLOWED_EXTENSIONS} · max 15 MB · {d.maxFiles}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {d.uploadBtn}
                    </span>
                </div>
            </div>

            {/* Optional note */}
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 italic">{d.optional}</p>

            {/* Pending file list */}
            {pendingFiles.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {pendingFiles.length} {d.selectedFiles}
                        </p>
                        {validCount > 0 && (
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                {validCount} {d.readyToUpload}
                            </span>
                        )}
                    </div>
                    {pendingFiles.map(p => (
                        <div
                            key={p.id}
                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${p.error
                                    ? "border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800"
                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
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
                                    className="w-40 sm:w-48 px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => setPendingFiles(prev => prev.filter(x => x.id !== p.id))}
                                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    {/* Upload CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading || validCount === 0}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all"
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
                        <p className="text-xs text-gray-400 italic">{d.notifyAdmin}</p>
                    </div>
                </div>
            )}

            {/* Feedback */}
            {uploadSuccess && !isUploading && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm font-medium animate-in fade-in duration-300">
                    ✅ {d.successUpload}
                </div>
            )}
            {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm animate-in fade-in duration-300">
                    ⚠️ {uploadError}
                </div>
            )}
        </div>
    );
}
