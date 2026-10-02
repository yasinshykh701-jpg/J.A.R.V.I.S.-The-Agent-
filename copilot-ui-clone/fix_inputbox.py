with open('src/components/InputBox.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
found_first = False
for line in lines:
    if "const [isTranscribing, setIsTranscribing] = useState(false);" in line:
        if not found_first:
            found_first = True
            new_lines.append(line)
        else:
            # Skip the duplicate
            continue
    else:
        new_lines.append(line)

with open('src/components/InputBox.tsx', 'w') as f:
    f.writelines(new_lines)
