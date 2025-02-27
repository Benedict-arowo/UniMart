import React, { useRef } from 'react'
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  id: string
  accept: string
  onFileSelect: (file: File) => void
}

export const FileUploader: React.FC<FileUploaderProps> = ({ id, accept, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div>
      <input
        type="file"
        id={id}
        accept={accept}
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <Button type="button" onClick={() => fileInputRef.current?.click()}>
        Upload File
      </Button>
    </div>
  )
}

