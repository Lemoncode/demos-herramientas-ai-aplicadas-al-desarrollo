export interface Chunk {
	title: string;
	content: string;
}

/**
 * Splits a markdown document into sections that can be embedded independently.
 *
 * Each `##` section becomes one chunk. The top-level document title is copied
 * into the first chunk so the embedding model sees document-level context as
 * well as the section body.
 *
 * @param markdown Full markdown document to split.
 * @returns Non-empty chunks created from `##` sections.
 */
export function chunkByHeaders(markdown: string): Chunk[] {
	// Split the document before each level-2 heading.
	// The lookahead keeps the "## Title" line inside the resulting section.
	const sections = markdown.split(/\n(?=## )/);

	// Keep the document-level title searchable/embeddable.
	// This gives the first section a little document-level context.
	const titleMatch = sections[0].match(/^# (.+)/m);
	const documentTitle = titleMatch ? titleMatch[1].trim() : "";

	return sections
		.map((section, idx): Chunk | null => {
			const firstLine = section.split("\n")[0];
			const headerMatch = firstLine.match(/^## (.+)/);

			if (!headerMatch) return null;

			const title = headerMatch[1].trim();
			const body = section.replace(/^## .+(?:\n|$)/, "").trim();
			const isFirstChunk = idx === 1;
			const content =
				isFirstChunk && documentTitle ? `${documentTitle}\n${body}` : body;

			return content ? { title, content } : null;
		})
		.filter((chunk): chunk is Chunk => chunk !== null);
}
