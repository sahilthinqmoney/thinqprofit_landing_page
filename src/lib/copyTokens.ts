/**
 * Inline copy tokens.
 *
 * Copy-deck strings carry three kinds of inline markup that must survive to the
 * page unchanged: `**bold**`, `[link](href)`, and bare `[PLACEHOLDER]` values
 * that compliance has not filled in yet. Tokenising rather than string-replacing
 * means not one character of the deck is altered.
 *
 * Lives outside the component file so `CopyText.tsx` exports a component and
 * nothing else — a mixed module breaks React Fast Refresh.
 */
export type CopyToken =
  | { kind: 'text'; value: string }
  | { kind: 'strong'; value: string }
  | { kind: 'placeholder'; value: string }
  | { kind: 'link'; value: string; href: string }

const TOKEN_PATTERN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]*)\)|\[([^\]]+)\]/g

export function tokenizeCopy(input: string): CopyToken[] {
  const tokens: CopyToken[] = []
  let cursor = 0

  for (const match of input.matchAll(TOKEN_PATTERN)) {
    const at = match.index ?? 0
    if (at > cursor) {
      tokens.push({ kind: 'text', value: input.slice(cursor, at) })
    }

    if (match[1] !== undefined) {
      tokens.push({ kind: 'strong', value: match[1] })
    } else if (match[2] !== undefined) {
      tokens.push({ kind: 'link', value: match[2], href: match[3] || '#' })
    } else if (match[4] !== undefined) {
      tokens.push({ kind: 'placeholder', value: match[4] })
    }

    cursor = at + match[0].length
  }

  if (cursor < input.length) {
    tokens.push({ kind: 'text', value: input.slice(cursor) })
  }

  return tokens
}
