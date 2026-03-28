import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { Settings } from 'lucide-react'

type SettingsToggleProps = {
  fontFamily: string
  setFontFamily: (font: string) => void
  fontSize: number
  setFontSize: (size: number) => void
}

const fontOptions = [
  { label: 'Default', value: 'system-ui, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Lora', value: 'Lora, serif' }
]

export function SettingsToggle({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize
}: SettingsToggleProps) {
  const decreaseFont = () => setFontSize(Math.max(14, fontSize - 2))
  const increaseFont = () => setFontSize(Math.min(28, fontSize + 2))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          variant="outline"
          size="icon"
        >
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-4 space-y-4 w-80">
        {/* Font selection row */}
        <div className="flex space-x-2 justify-between">
          {fontOptions.map((font) => (
            <Button
              key={font.value}
              variant={fontFamily === font.value ? 'default' : 'outline'}
              onClick={() => setFontFamily(font.value)}
              className="flex-1 cursor-pointer"
            >
              {font.label}
            </Button>
          ))}
        </div>

        {/* Font size slider row */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span
              onClick={decreaseFont}
              className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              A-
            </span>
            <span className="text-sm">{fontSize}px</span>
            <span
              onClick={increaseFont}
              className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              A+
            </span>
          </div>
          <Slider
            className="cursor-pointer"
            min={14}
            max={28}
            step={2}
            value={[fontSize]}
            onValueChange={(val) => setFontSize(val[0])}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
