export function formatGehuResponse(content: string): string {
  const lines = content.split('\n');
  let formattedContent = '';
  let indentLevel = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('- ')) {
      formattedContent += '  '.repeat(indentLevel) + trimmedLine + '\n';
    } else if (trimmedLine.endsWith(':')) {
      formattedContent += '  '.repeat(indentLevel) + trimmedLine + '\n';
      indentLevel++;
    } else {
      if (indentLevel > 0) indentLevel--;
      formattedContent += '  '.repeat(indentLevel) + trimmedLine + '\n';
    }
  }

  return formattedContent.trim();
}

