import parse from 'html-react-parser'
import { createStore, get, set } from 'idb-keyval'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import ContentSelection from '@/components/content/content-selection'
import { SettingsToggle } from '@/components/settings/settings-toggle'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { ThemeProvider } from '@/components/theme/theme-provider'

import { normalizeName } from '@/utils'

const store = createStore('posts-db', 'files')

const App = () => {
  const [folders, setFolders] = useState<string[]>([])
  const [content, setContent] = useState<React.ReactNode | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  // Font state
  const [fontFamily, setFontFamily] = useState<string>('system-ui, sans-serif')
  const [fontSize, setFontSize] = useState<number>(18)

  const currentYear = new Date().getFullYear()

  const pickAndCopy = async () => {
    setLoading(true)

    try {
      if (!window.showDirectoryPicker) {
        alert('FS Access API not supported')
        return
      }

      const dirHandle = await (window as any).showDirectoryPicker()
      const folderNames = []

      // copy each folder/file into IndexedDB (simulate src/)
      for await (const [folderName, folderHandle] of dirHandle.entries()) {
        if (folderHandle.kind === 'directory') {
          const cleanFolder = normalizeName(folderName)
          folderNames.push(folderName)
          const postInfoHandle = await folderHandle.getDirectoryHandle('post_info')

          for await (const [fileName, fileHandle] of postInfoHandle.entries()) {
            if (fileHandle.kind === 'file' && fileName.endsWith('.json')) {
              const file = await fileHandle.getFile()
              const text = await file.text()
              const parsedText = JSON.parse(text)
              const content = parsedText.data.attributes.content

              const key = `posts/${cleanFolder}`
              await set(key, content, store)
              // console.log(`✅ Stored: ${key}`)
              // console.log(`✅ StoredData: ${content}`)
            }
          }
        }
      }

      setFolders(folderNames)
      if (folderNames.length > 0) {
        setSelectedFolder(folderNames[0]) // default first folder
      }

      console.log('✅ All post_info JSON files stored into IndexedDB')
    } catch (err) {
      console.error('❌ Failed to pick and copy folder:', err)
    } finally {
      setLoading(false)
    }
  }

  const readJson = useCallback(async (contentFolder: string) => {
    try {
      const cleanFolder = normalizeName(contentFolder)
      const key = `posts/${cleanFolder}`
      const text = await get(key, store)

      if (!text) throw new Error(`File not found: ${key}`)

      // Parse HTML string into React nodes
      setContent(parse(text))

      // setSelectedFolder(contentFolder)
    } catch (err) {
      console.error('❌ Failed to read JSON:', err)
      setContent(null)
    }
  }, [])

  const handlePrev = () => {
    if (!selectedFolder || folders.length === 0) return
    const idx = folders.indexOf(selectedFolder)
    const prevIdx = (idx - 1 + folders.length) % folders.length
    setSelectedFolder(folders[prevIdx])
  }

  const handleNext = () => {
    if (!selectedFolder || folders.length === 0) return
    const idx = folders.indexOf(selectedFolder)
    const nextIdx = (idx + 1) % folders.length
    setSelectedFolder(folders[nextIdx])
  }

  useEffect(() => {
    if (selectedFolder) {
      readJson(selectedFolder)
    }
  }, [selectedFolder, readJson])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <div className="nav-bar bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-50 p-2 flex flex-row justify-between">
          <ModeToggle />
          <span
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            onClick={handlePrev}
          >
            <ChevronLeft />
          </span>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : folders.length > 0 ? (
            <ContentSelection
              folders={folders}
              selectedFolder={selectedFolder}
              onSelectFolder={setSelectedFolder}
            />
          ) : (
            <button className="cursor-pointer" onClick={pickAndCopy}>
              Select Folder
            </button>
          )}
          <span
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            onClick={handleNext}
          >
            <ChevronRight />
          </span>
          <SettingsToggle
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </div>

        <main className="flex-grow flex justify-center items-start pt-16">
          <div
            className={`content-wrap pt-8 pl-6 pr-6 space-y-4 text-left lg:max-w-[980px] font-${fontFamily}`}
            style={{ fontFamily, fontSize: `${fontSize}px` }}
          >
            {content ? content : 'No content yet! Select the novel folder!'}
          </div>
        </main>

        <footer className="mt-auto flex justify-center items-center py-4 bg-gray-100 dark:bg-gray-900">
          &copy; Novel Reader {currentYear}
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
