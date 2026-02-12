"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadZoneProps {
  onUpload: (urls: string[]) => void;
  maxPhotos: number;
  currentCount: number;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function PhotoUploadZone({
  onUpload,
  maxPhotos,
  currentCount,
  uploading,
  setUploading,
}: PhotoUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const remaining = maxPhotos - currentCount;
      const toUpload = files
        .filter((f) => ACCEPTED_TYPES.includes(f.type))
        .slice(0, remaining);

      if (toUpload.length === 0) {
        if (currentCount >= maxPhotos) {
          toast.error(`Maximum ${maxPhotos} photos allowed`);
        } else {
          toast.error("Invalid file type. Use JPEG, PNG, WebP, or GIF.");
        }
        return;
      }

      setUploading(true);
      const uploaded: string[] = [];

      try {
        for (const file of toUpload) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} is too large (max 5MB)`);
            continue;
          }

          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const { url } = await res.json();
            uploaded.push(url);
          } else {
            const data = await res.json();
            toast.error(data.error || "Failed to upload photo");
          }
        }

        if (uploaded.length > 0) {
          onUpload(uploaded);
        }
      } catch {
        toast.error("Failed to upload photos");
      } finally {
        setUploading(false);
      }
    },
    [maxPhotos, currentCount, onUpload, setUploading]
  );

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files?.length) {
      uploadFiles(Array.from(files));
    }
    e.target.value = "";
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
        isDragOver
          ? "border-ocean bg-ocean/5"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
      }`}
    >
      {uploading ? (
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      ) : (
        <Upload
          className={`h-8 w-8 ${isDragOver ? "text-ocean" : "text-gray-400"}`}
        />
      )}
      <span className="text-sm text-gray-500 mt-2">
        {uploading
          ? "Uploading..."
          : isDragOver
            ? "Drop photos here"
            : "Drag & drop photos here, or click to select"}
      </span>
      <span className="text-xs text-gray-400 mt-1">
        {currentCount}/{maxPhotos} photos &middot; Max 5MB each
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
}
