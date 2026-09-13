import type { WritingBlock } from "@/lib/writing";
import { renderInlineMarkdown } from "@/lib/writing";
import { DIAGRAMS } from "@/components/writing/diagrams/AgentDiagrams";

function containsBoxDrawing(code: string): boolean {
  return /[┌┐└┘├┤┬┴┼─│▼▲►◄↓↑]/.test(code);
}

function Inline({ text }: { text: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }} />;
}

function CodeFigure({ lang, code }: { lang: string; code: string }) {
  const isDiagram = lang === "" || lang === "text" ? containsBoxDrawing(code) || code.split("\n").length > 2 : false;
  return (
    <figure className="w-figure">
      <pre className={isDiagram ? "w-code w-code-diagram" : "w-code"}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export function ArticleBody({ blocks }: { blocks: WritingBlock[] }) {
  // Drop a leading H1 that duplicates the article title (frontmatter already renders it).
  const visible = blocks[0]?.type === "heading" && blocks[0].level === 1 ? blocks.slice(1) : blocks;

  return (
    <div className="w-body">
      {visible.map((block, index) => {
        switch (block.type) {
          case "heading":
            if (block.level === 1 || block.level === 2) {
              return (
                <h2 key={index} className="w-h2">
                  <Inline text={block.text} />
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3 key={index} className="w-h3">
                  <Inline text={block.text} />
                </h3>
              );
            }
            return (
              <h4 key={index} className="w-h4">
                <Inline text={block.text} />
              </h4>
            );
          case "paragraph":
            return (
              <p key={index}>
                <Inline text={block.text} />
              </p>
            );
          case "quote":
            return (
              <blockquote key={index} className="w-quote">
                {block.lines.map((line, lineIndex) => (
                  <p key={lineIndex}>
                    <Inline text={line} />
                  </p>
                ))}
              </blockquote>
            );
          case "code":
            return <CodeFigure key={index} lang={block.lang} code={block.code} />;
          case "diagram": {
            const entry = DIAGRAMS[block.id];
            if (!entry) {
              return <CodeFigure key={index} lang="text" code={block.fallback} />;
            }
            const Diagram = entry.Component;
            return (
              <figure key={index} className="w-figure">
                <Diagram />
                <figcaption className="w-figcaption">{entry.caption}</figcaption>
              </figure>
            );
          }
          case "list":
            if (block.ordered) {
              return (
                <ol key={index} className="w-list">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Inline text={item} />
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={index} className="w-list">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div key={index} className="w-table-scroll">
                <table className="w-table">
                  <thead>
                    <tr>
                      {block.header.map((cell, cellIndex) => (
                        <th key={cellIndex}>
                          <Inline text={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "image":
            return (
              <figure key={index} className="w-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={block.alt} loading="lazy" />
                {block.alt ? <figcaption className="w-figcaption">{block.alt}</figcaption> : null}
              </figure>
            );
          case "hr":
            return <hr key={index} className="w-rule" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
