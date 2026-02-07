import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  // const { theme } = useTheme(); // Next-themes might not be installed, use manual dark mode for now as per instructions

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900" data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={onChange}
        height={500}
        preview="live"
        className="dark:bg-slate-900 dark:text-slate-200"
        visibleDragbar={false}
      />
    </div>
  );
}
