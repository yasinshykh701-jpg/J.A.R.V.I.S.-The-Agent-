import React from 'react';
import { Save, Trash2 } from 'lucide-react';

type TextEditorProps = {
  text: string;
  translatedText: string;
  isTranslating: boolean;
  onChange: (text: string) => void;
  onClear: () => void;
  onSaveDraft: () => void;
};

export function TextEditor({ 
  text,
  translatedText,
  isTranslating,
  onChange, 
  onClear, 
  onSaveDraft 
}: TextEditorProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="在此输入文字..."
          className="w-full h-32 p-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-inner 
                     border border-purple-100 focus:border-purple-300 focus:ring-2 
                     focus:ring-purple-200 outline-none resize-none"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 
                       transition-colors duration-200"
            title="清除文本"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={onSaveDraft}
            className="p-2 rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100 
                       transition-colors duration-200"
            title="保存草稿"
          >
            <Save size={20} />
          </button>
        </div>
      </div>

      {/* 翻译结果 */}
      {text && (
        <div className="relative">
          <textarea
            value={isTranslating ? '翻译中...' : translatedText}
            readOnly
            className="w-full h-32 p-4 rounded-xl bg-gray-50/90 backdrop-blur-sm shadow-inner 
                       border border-gray-200 outline-none resize-none"
            placeholder="翻译结果将显示在这里..."
          />
          {isTranslating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}