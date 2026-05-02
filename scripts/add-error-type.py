#!/usr/bin/env python3
"""
Add errorType: 'generic' to all NextResponse.json({ error: ... }) calls
in API routes that don't already have errorType.
"""

import re
from pathlib import Path

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Line-by-line approach for safety
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'NextResponse.json' in line and 'error:' in line and 'errorType' not in line:
            # Case 1: { error: '...' }  →  { error: '...', errorType: 'generic' }
            line = re.sub(
                r"(\{ error: '[^']*')(?![^}]*errorType)(\s*\},)",
                r"\1, errorType: 'generic'\2",
                line
            )
            # Case 2: { error: '...', retryAfter: 60 }  →  add errorType after error field
            line = re.sub(
                r"(\{ error: '[^']*')(?![^}]*errorType)(,\s+\w+:)",
                r"\1, errorType: 'generic'\2",
                line
            )
            # Case 3: { error: '...' } without trailing comma, standalone
            line = re.sub(
                r"(\{ error: '[^']*')(?![^}]*errorType)(\s*\})",
                r"\1, errorType: 'generic'\2",
                line
            )
        new_lines.append(line)
    content = '\n'.join(new_lines)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

api_dir = Path('src/app/api')
fixed_count = 0
for filepath in api_dir.rglob('*.ts'):
    if fix_file(filepath):
        fixed_count += 1
        print(f'Fixed: {filepath}')

print(f'\nTotal files modified: {fixed_count}')
