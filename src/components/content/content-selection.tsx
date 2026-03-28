import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { normalizeName } from '@/utils'

interface ContentSelectionProps {
  folders: string[] // array of folder names
  selectedFolder: string | null // currently selected folder or null
  onSelectFolder: (folder: string) => void // callback to parent
}

const ContentSelection: React.FC<ContentSelectionProps> = ({
  folders,
  selectedFolder,
  onSelectFolder
}) => {
  return (
    <Select
      onValueChange={(value) => {
        // ✅ call parent setter instead of readJson
        const original = folders.find((f) => normalizeName(f) === value)
        if (original) onSelectFolder(original)
      }}
      value={selectedFolder ? normalizeName(selectedFolder) : undefined}
    >
      <SelectTrigger className="w-full cursor-pointer truncate">
        <SelectValue placeholder="Select a chapter" className="truncate" />
      </SelectTrigger>
      <SelectContent>
        {folders.map((f) => (
          <SelectItem
            className="cursor-pointer truncate max-w-[250px]" // limit width inside dropdown
            key={normalizeName(f)}
            value={normalizeName(f)}
          >
            {f}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ContentSelection
