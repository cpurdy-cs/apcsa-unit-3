// Small, dependency-free typing helpers for the Topic 3.4 constructor textarea.
// The editor remains a native textarea so selection, undo, copying, and autosave
// use the normal browser controls. Each handled key produces an ordinary input event.
export const JAVA_INDENT = '    ';

function lineStart(text, pos) {
  return text.lastIndexOf('\n', Math.max(0, pos - 1)) + 1;
}

export function editConstructorText(text, selectionStart, selectionEnd, key, shiftKey = false) {
  const start = Math.max(0, Math.min(selectionStart, text.length));
  const end = Math.max(start, Math.min(selectionEnd, text.length));
  if (key === 'Enter') {
    const before = text.slice(lineStart(text, start), start);
    const leading = (before.match(/^[ \t]*/) || [''])[0].replace(/\t/g, JAVA_INDENT);
    const extra = before.trimEnd().endsWith('{') ? JAVA_INDENT : '';
    const inserted = '\n' + leading + extra;
    const pos = start + inserted.length;
    return {text: text.slice(0, start) + inserted + text.slice(end), start: pos, end: pos};
  }
  if (key === '}' && start === end) {
    const from = lineStart(text, start);
    const before = text.slice(from, start);
    if (before.length >= JAVA_INDENT.length && /^ +$/.test(before)) {
      const remove = Math.min(JAVA_INDENT.length, before.length);
      const pos = start - remove + 1;
      return {text: text.slice(0, start - remove) + '}' + text.slice(end), start: pos, end: pos};
    }
    return null; // Normal browser insertion handles non-indented closing braces.
  }
  if (key !== 'Tab') return null;

  // For one cursor, Tab inserts spaces; Shift+Tab removes up to four leading
  // spaces from the current line. For multiline selections, indent/outdent lines.
  if (!shiftKey && (start === end || !text.slice(start, end).includes('\n'))) {
    const pos = start + JAVA_INDENT.length;
    return {text: text.slice(0, start) + JAVA_INDENT + text.slice(end), start: pos, end: pos};
  }
  const from = lineStart(text, start);
  // A selection ending directly after a newline should not modify the next line.
  const lastChar = end > start && text[end - 1] === '\n' ? end - 1 : end;
  const lastBreak = text.indexOf('\n', lastChar);
  const to = lastBreak < 0 ? text.length : lastBreak;
  const oldBlock = text.slice(from, to);
  const block = oldBlock.split('\n').map(line => {
    if (!shiftKey) return JAVA_INDENT + line;
    if (line.startsWith('\t')) return line.slice(1);
    return line.slice(Math.min((line.match(/^ */) || [''])[0].length, JAVA_INDENT.length));
  }).join('\n');
  return {text: text.slice(0, from) + block + text.slice(to), start: from, end: from + block.length};
}

export function handleConstructorEditorKeydown(event) {
  const el = event.target;
  if (el?.id !== '34-constructor-editor') return false;
  if (event.key === 'Escape') {
    // Allows keyboard users to move to the next form control with Tab.
    el.dataset.tabNavigation = 'yes';
    return false;
  }
  if (event.key === 'Tab' && el.dataset.tabNavigation === 'yes') {
    delete el.dataset.tabNavigation;
    return false;
  }
  if (event.ctrlKey || event.altKey || event.metaKey) return false;
  if (!['Tab', 'Enter', '}'].includes(event.key)) return false;
  const edit = editConstructorText(el.value, el.selectionStart, el.selectionEnd, event.key, !!event.shiftKey);
  if (!edit) return false;
  event.preventDefault();
  el.value = edit.text;
  el.setSelectionRange(edit.start, edit.end);
  // Triggers existing autosave and live code preview logic without duplicating it.
  el.dispatchEvent(new Event('input', {bubbles: true}));
  return true;
}
