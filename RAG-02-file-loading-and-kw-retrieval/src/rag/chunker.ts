export interface Chunk {
	title: string;
	content: string;
}

/**
 * Splits a markdown document into retrieval chunks using level-2 headings.
 *
 * The document title (`# ...`) is copied into the first chunk so document-level
 * words are still available to the retriever. Each returned chunk keeps the
 * heading text as `title` and the section body as `content`.
 *
 * @param markdown Full markdown document to split.
 * @returns Non-empty chunks created from `##` sections.
 */
export function chunkByHeaders(markdown: string): Chunk[] {
	// Split the document before each level-2 heading.
	// The lookahead keeps the "## Title" line inside the resulting section.
	const sections = markdown.split(/\n(?=## )/);

	// Keep the document-level title searchable.
	// This is useful for lexical search engines such as BM25, where exact terms
	// from the H1 title may be important for matching queries.
	const titleMatch = sections[0].match(/^# (.+)/m);
	const documentTitle = titleMatch ? titleMatch[1].trim() : "";

	return sections
		.map((section, idx): Chunk | null => {
			// Ignore the document preamble, because chunks are created only from
			// level-2 sections.
			const firstLine = section.split("\n")[0];
			const headerMatch = firstLine.match(/^## (.+)/);

			if (!headerMatch) return null;

			const title = headerMatch[1].trim();

			// Remove the "## Title" line and keep only the section body.
			// The regex also handles sections that contain only a header.
			const body = section.replace(/^## .+(?:\n|$)/, "").trim();

			// The first actual section is usually at index 1 because index 0 contains
			// the H1 title/preamble. Add the document title to that first chunk so
			// document-level terms are not lost during indexing.
			const isFirstChunk = idx === 1;
			const content =
				isFirstChunk && documentTitle ? `${documentTitle}\n${body}` : body;

			return content ? { title, content } : null;
		})
		.filter((chunk): chunk is Chunk => chunk !== null);
}
