import { Play, Code, TerminalSquare } from 'lucide-react';
import { useState } from 'react';

export function PythonExecution() {
  const [code, setCode] = useState('print("Hello from Python backend!")\\n');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    
    try {
      const response = await fetch('/api/python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const contentType = response.headers.get("content-type");
      let data: any = {};
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (Status: ${response.status})`);
      }
      
      if (!response.ok) {
        setError(data.error || 'Execution failed');
        if (data.stderr) {
          setError((prev) => prev + '\\n' + data.stderr);
        }
      } else {
        setOutput(data.output || 'No output');
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full max-w-5xl mx-auto py-6">
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-display text-ink font-bold drop-shadow-sm flex items-center gap-3">
            <TerminalSquare size={28} className="text-accent" /> Python Execution
          </h2>
          <p className="text-neutral-500 text-sm mt-1">Run Python scripts and custom code on the secure backend</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-2 min-w-0 bg-bg rounded-[24px] border border-white/50 overflow-hidden shadow-neu-lg relative p-1.5">
          <div className="flex justify-between items-center px-4 py-2.5 border-b border-ink-faint bg-white/40 rounded-t-2xl">
            <span className="text-xs font-bold text-neutral-600 flex items-center gap-2">
              <Code size={16} className="text-neutral-400" /> script.py
            </span>
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer border border-white/50 shadow-neu-sm ${isRunning ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed hover:shadow-none' : 'bg-bg hover:shadow-neu-sm-inset text-accent'}`}
            >
              {isRunning ? (
                <>Running...</>
              ) : (
                <><Play size={14} fill="currentColor" /> Run Script</>
              )}
            </button>
          </div>
          <div className="flex-1 p-2 bg-transparent">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-[#1C1C1E] text-[#FF9500] font-mono text-xs rounded-2xl border border-white/5 shadow-neu-sm-inset outline-none resize-none whitespace-pre focus:shadow-neu-inset"
              spellCheck={false}
              style={{ tabSize: 4 }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 min-w-0 bg-bg rounded-[24px] border border-white/50 overflow-hidden shadow-neu-lg p-1.5">
          <div className="px-4 py-3 border-b border-ink-faint bg-white/40 flex items-center gap-2 rounded-t-2xl">
            <TerminalSquare size={16} className="text-neutral-400" /> 
            <span className="text-xs font-bold text-neutral-600">Output Log</span>
          </div>
          <div className="flex-1 p-2 bg-transparent">
            <div className="w-full h-full p-4 bg-[#1C1C1E] font-mono text-xs shadow-neu-sm-inset rounded-2xl overflow-y-auto border border-white/5">
              {output && <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>}
              {error && <pre className="text-red-400 whitespace-pre-wrap mt-2">{error}</pre>}
              {!output && !error && !isRunning && (
                <span className="text-neutral-500 italic">No output yet...</span>
              )}
              {isRunning && <span className="text-[#34C759] animate-pulse">Executing code on sandbox...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
