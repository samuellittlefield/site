import type { Block } from '@/lib/projects'

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.', 'vii.', 'viii.']

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i}>{b.text}</p>
          case 'placeholder':
            return (
              <p key={i} className="placeholder">
                {b.text}
              </p>
            )
          case 'list':
            return (
              <ol key={i} className="numbered">
                {b.items.map((item, j) => (
                  <li key={j}>
                    <span className="n" aria-hidden="true">
                      {ROMAN[j]}
                    </span>
                    <span>
                      {item.lead && <strong>{item.lead}</strong>} {item.text}
                    </span>
                  </li>
                ))}
              </ol>
            )
          case 'bars':
            return (
              <figure key={i} className="bars">
                <div className="bars-plot" role="img" aria-label={b.label}>
                  {b.bars.map((bar) => (
                    <div key={bar.label} className={`bar${bar.emphasis ? ' em' : ''}`} aria-hidden="true">
                      <span>{bar.display}</span>
                      <i style={{ height: `${(bar.value / b.max) * 85}%` }} />
                    </div>
                  ))}
                </div>
                <div className="bars-axis" aria-hidden="true">
                  {b.bars.map((bar) => (
                    <span key={bar.label}>{bar.label}</span>
                  ))}
                </div>
                <figcaption>{b.caption}</figcaption>
              </figure>
            )
          case 'table':
            return (
              <div key={i} className="table-wrap">
                <table className={`table${b.align === 'left' ? ' left' : ''}`}>
                  <caption>{b.caption}</caption>
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.cells.map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={c} className={row.emphasis?.includes(c) ? 'em' : undefined}>
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        }
      })}
    </>
  )
}
