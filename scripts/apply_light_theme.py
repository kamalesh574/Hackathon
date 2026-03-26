import os
import glob

replacements = {
    'bg-background': 'bg-slate-50',
    'bg-secondary': 'bg-white',
    'text-white': 'text-slate-900',
    'border-white/5': 'border-slate-200',
    'border-white/10': 'border-slate-200',
    'bg-white/5': 'bg-white shadow-sm border border-slate-200',
    'bg-white/10': 'bg-slate-50',
    'hover:bg-white/5': 'hover:bg-slate-50',
    'hover:bg-white/10': 'hover:bg-slate-100',
    'text-slate-400': 'text-slate-500',
    'text-slate-300': 'text-slate-600',
    'text-slate-200': 'text-slate-800',
    'bg-white text-black': 'bg-slate-900 text-white',
    'text-secondary-400': 'text-slate-500', 
    'border-white/20': 'border-slate-300'
}

print("Applying Light Mode Theme...")
for filepath in glob.glob('d:/ChurnSense/frontend_react/src/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print("Done.")
