export function insertText(text, prevValue, prevSelectionStart, prevSelectionEnd) {
    const prefix = prevValue.slice(0, prevSelectionStart);
    const suffix = prevValue.slice(prevSelectionEnd);

    const value = prefix + text + suffix;
    const caretPosition = (prefix + text).length;

    return {
        value,
        selectionStart: caretPosition,
        selectionEnd: caretPosition
    };
}
