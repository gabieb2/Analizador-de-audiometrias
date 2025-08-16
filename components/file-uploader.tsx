"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText } from "lucide-react"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
}

export default function FileUploader({ onFileUpload, uploadedFile }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    if (file.name.toLowerCase().endsWith(".xpt")) {
      onFileUpload(file)
    } else {
      alert("Por favor, sube un archivo con extensión .XPT")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <div className="flex flex-col items-center">
      <input type="file" id="file-upload" className="hidden" accept=".xpt" onChange={handleFileChange} />
      <label htmlFor="file-upload" className="w-full cursor-pointer">
        <div
          className={`flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg text-center p-4 transition-all duration-300 ${
            isDragOver
              ? "border-primary bg-primary/10"
              : uploadedFile
                ? "border-green-500 bg-green-50"
                : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div>
            {uploadedFile ? (
              <>
                <FileText className="mx-auto h-12 w-12 text-green-600" />
                <p className="mt-2 text-lg text-green-600 font-semibold">¡Archivo listo!</p>
                <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta.
                </p>
                <p className="text-xs text-muted-foreground">Solo archivos .XPT</p>
              </>
            )}
          </div>
        </div>
      </label>
      {uploadedFile && <p className="mt-2 text-sm text-muted-foreground">Archivo seleccionado: {uploadedFile.name}</p>}
    </div>
  )
}
