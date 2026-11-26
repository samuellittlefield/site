// All portfolio content lives here. Edit copy in this file; layout lives in components/.
// Anything in [BRACKETS] is a placeholder that still needs Samuel's words.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: { lead?: string; text: string }[] }
  | {
      type: 'bars'
      caption: string
      label: string
      max: number
      bars: { label: string; value: number; display: string; emphasis?: boolean }[]
    }
  | {
      type: 'table'
      caption: string
      head: string[]
      rows: { cells: string[]; emphasis?: number[] }[]
    }
  | { type: 'placeholder'; text: string }

export type Section = {
  id: string
  title: string
  blocks: Block[]
  note?: string
}

export type Project = {
  slug: string
  no: string
  title: string
  field: string
  year: string
  summary: string
  deck: string
  stack: string
  meta: { label: string; value: string; href?: string }[]
  links: { label: string; href: string }[]
  image?: { src: string; alt: string; caption: string }
  sections: Section[]
}

const WHAT_I_LEARNED: Section = {
  id: 'learned',
  title: 'What I learned',
  blocks: [
    {
      type: 'placeholder',
      text: '[IN YOUR WORDS: two or three things you learned building it, about the data, the domain, or how you made product calls. Then one line on what you would build next.]',
    },
  ],
}

export const projects: Project[] = [
  {
    slug: 'almanac-grid',
    no: '01',
    title: 'Almanac Grid',
    field: 'Energy',
    year: '2026',
    summary:
      'A free tracker of federal permitting outcomes, built from public agency records. It starts with how long the Bureau of Land Management takes to decide on solar, wind and transmission applications.',
    deck: 'How long does the federal government take to decide on energy projects on public land? A free tracker built from Bureau of Land Management case records.',
    stack: 'Python · FastAPI · PostgreSQL',
    meta: [
      { label: 'Role', value: 'Solo project' },
      { label: 'Year', value: '2026' },
      { label: 'Source', value: 'BLM case records' },
      { label: 'Built with', value: 'Python, FastAPI, PostgreSQL' },
      { label: 'Status', value: 'Live ↗', href: 'https://almanac.samuellittlefield.com/' },
    ],
    links: [{ label: 'Visit the site', href: 'https://almanac.samuellittlefield.com/' }],
    image: {
      src: '/work/almanac-grid.jpg',
      alt: 'Almanac Grid page on how long BLM takes to decide solar right-of-way applications',
      caption: 'The BLM solar page, data as of November 17, 2026.',
    },
    sections: [
      {
        id: 'why',
        title: 'Why I built it',
        blocks: [
          {
            type: 'p',
            text: "BAAJA, the permitting reform bill, aims to speed up federal decisions on energy projects. Reading it with Claude, I found no central record of the projects it would affect, so nothing to measure that aim against. Almanac Grid is that record, scored against the bill's own test.",
          },
          { type: 'p', text: 'Developers and litigators look like its first real readers.' },
        ],
        note: 'Covers BLM rights-of-way for solar, wind, transmission and pipelines, plus geothermal leases.',
      },
      {
        id: 'records',
        title: "What the records don't say",
        blocks: [
          {
            type: 'p',
            text: 'Public agency data has gaps, and an honest tracker says so up front. The site opens with four caveats before it shows a single chart.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'The clock starts on arrival, not completeness.',
                text: 'BLM records when it received an application, not when it was complete enough to process, so every elapsed time overstates delay.',
              },
              {
                lead: 'Denial rates are lower bounds.',
                text: 'BLM closed many cases without recording a grant, rejection or withdrawal.',
              },
              {
                lead: '"Decided" is not "approved."',
                text: 'It means any final disposition: granted, rejected, withdrawn or closed.',
              },
              {
                lead: 'The numbers are small.',
                text: "11 to 76 solar applications a year, so a few cases move a year's percentage by several points.",
              },
            ],
          },
        ],
        note: 'BLM closed 20% of the solar decisions, and 38% of the wind decisions, with no reason recorded.',
      },
      {
        id: 'found',
        title: 'What it found',
        blocks: [
          {
            type: 'p',
            text: 'Solar decisions slowed sharply after 2020. BLM grants about the same share of applications as before; what changed is that far fewer get resolved at all.',
          },
          {
            type: 'bars',
            label:
              'Share of BLM solar applications decided within 12 months, by year filed: 2016 35%, 2017 9%, 2018 44%, 2019 36%, 2020 40%, 2021 20%, 2022 8%, 2023 11%, 2024 10%, 2025 10%.',
            caption:
              'Fig. 1. Percent of BLM solar applications decided within 12 months, by year filed. 2016 to 2020 in grey, 2021 to 2025 in green. 2025 is partial.',
            max: 50,
            bars: [
              { label: '’16', value: 35.3, display: '35' },
              { label: '’17', value: 9.1, display: '9' },
              { label: '’18', value: 44.4, display: '44' },
              { label: '’19', value: 36.4, display: '36' },
              { label: '’20', value: 39.5, display: '40' },
              { label: '’21', value: 20.0, display: '20', emphasis: true },
              { label: '’22', value: 7.9, display: '8', emphasis: true },
              { label: '’23', value: 10.8, display: '11', emphasis: true },
              { label: '’24', value: 9.8, display: '10', emphasis: true },
              { label: '’25', value: 10.3, display: '10', emphasis: true },
            ],
          },
          {
            type: 'table',
            caption: 'Table 1. Status of solar applications 36 months after filing.',
            head: ['Filed', 'Granted', 'Rejected', 'Withdrawn', 'Still pending'],
            rows: [
              { cells: ['2016–19', '10%', '21%', '30%', '37%'] },
              { cells: ['2020–22', '9%', '3%', '15%', '63%'], emphasis: [2, 4] },
              { cells: ['2023', '6%', '10%', '18%', '66%'] },
            ],
          },
        ],
        note: 'On November 17, 2026, 92% of open solar applications were more than 60 days past deadline, against a 67% baseline for the previous five years.',
      },
      {
        id: 'matters',
        title: 'Why it matters now',
        blocks: [
          {
            type: 'p',
            text: "Section 1402 of BAAJA, which passed the Senate on November 19, 2026, would hold agencies to permitting deadlines by comparing each year's overdue share against earlier years. It is not law. Almanac Grid applies the bill's test to past years so readers can see where BLM would stand, and says plainly that these figures are not a finding under it.",
          },
        ],
        note: 'Passed as an amendment to H.R. 2347.',
      },
      WHAT_I_LEARNED,
    ],
  },
  {
    slug: 'pge-rate-comparer',
    no: '02',
    title: 'PG&E Rate Comparer',
    field: 'Energy',
    year: '2026',
    summary:
      "Prices one household's hourly usage under four PG&E residential plans, splits delivery from community choice generation charges, and checks the model against 20 real bills.",
    deck: "What would one household's electricity actually cost on each PG&E plan? A rate model built on real hourly usage, with every rate cited.",
    stack: 'Python · pandas · Green Button data',
    meta: [
      { label: 'Role', value: 'Solo project' },
      { label: 'Year', value: '2026' },
      { label: 'Source', value: 'Green Button usage, PG&E and MCE tariffs' },
      { label: 'Built with', value: 'Python, pandas' },
      { label: 'Status', value: 'Sample report ↗', href: 'https://pge.samuellittlefield.com/' },
    ],
    links: [{ label: 'Sample report', href: 'https://pge.samuellittlefield.com/' }],
    image: {
      src: '/work/pge-rate-comparer.jpg',
      alt: 'PG&E rate comparison report for a synthetic sample household',
      caption: 'The comparison report, run on a synthetic sample household.',
    },
    sections: [
      {
        id: 'why',
        title: 'Why I built it',
        blocks: [
          {
            type: 'p',
            text: "I built this to learn the energy business from the inside of my own bill. What mattered most wasn't which plan came out cheapest. It was how little the customer decides. MCE chooses where my power comes from, PG&E delivers it, and the City of Richmond adds its taxes on top. Even the choice of rate plan leaves little room to save by changing how or when you use power. The tool makes that system visible: one household's real usage, priced line by line, with every rate cited.",
          },
        ],
        note: 'MCE is a community choice aggregator: it supplies the power, while PG&E delivers it and sends the bill.',
      },
      {
        id: 'how',
        title: 'How it works',
        blocks: [
          {
            type: 'list',
            items: [
              {
                lead: 'Parse.',
                text: "Reads PG&E's Green Button exports, the hourly usage file any customer can download, and handles their quirks: daylight saving gaps, overlapping files and estimated reads.",
              },
              {
                lead: 'Price.',
                text: 'Prices a full year under E-TOU-C, E-TOU-D and E-1, plus E-ELEC as a labeled what-if. Every rate lives in a data file with its source and effective date.',
              },
              {
                lead: 'Check.',
                text: 'Reconciles the model against 20 real bills before trusting it.',
              },
              {
                lead: 'Share.',
                text: 'Real usage never leaves my machine. The public report runs on a synthetic household built from NREL ResStock data.',
              },
            ],
          },
        ],
        note: "The cost column in PG&E's own usage export runs 10 to 40% below the real bill, so the tool ignores it.",
      },
      {
        id: 'labels',
        title: 'Call every number what it is',
        blocks: [
          { type: 'p', text: 'Every figure in the report carries a label for how it was derived.' },
          {
            type: 'list',
            items: [
              { lead: 'Verified.', text: 'Every input is cited and checked against a real bill.' },
              { lead: 'Modeled.', text: 'Computed from cited rates, not yet checked against a bill.' },
              { lead: 'Inferred.', text: 'Estimated from the data, and never used as a rate.' },
              { lead: 'Not determinable.', text: 'Said out loud instead of guessed.' },
            ],
          },
          { type: 'p', text: 'Anything short of verified tells the reader what would verify it.' },
        ],
      },
      {
        id: 'sample',
        title: 'Sample result',
        blocks: [
          {
            type: 'p',
            text: 'For the sample household, E-TOU-D comes out about $178 a year cheaper than E-TOU-C, the plan it is on today.',
          },
          {
            type: 'table',
            caption:
              "Table 1. Modeled annual cost for the synthetic sample household at current rates. E-ELEC is a what-if: it requires a qualifying technology the household doesn't have.",
            head: ['Plan', 'Annual cost', 'vs E-TOU-C'],
            rows: [
              { cells: ['E-TOU-C', '$4,031.95', '—'] },
              { cells: ['E-TOU-D', '$3,853.46', '−$178.49'], emphasis: [1, 2] },
              { cells: ['E-1', '$4,106.35', '+$74.40'] },
              { cells: ['E-ELEC (what-if)', '$3,701.10', '−$330.85'] },
            ],
          },
        ],
      },
      WHAT_I_LEARNED,
    ],
  },
  {
    slug: 'house-polling',
    no: '03',
    title: '2026 House Polling',
    field: 'Elections',
    year: '2026',
    summary:
      'All 435 House districts as an equal-size hex cartogram, with approval tracking, issue polling, and candidates and fundraising for every district.',
    deck: 'Where was the House heading in 2026? Every district on one map, built from public polling, candidate filings and prediction markets.',
    stack: 'React · FastAPI · PostgreSQL',
    meta: [
      { label: 'Role', value: 'Solo project' },
      { label: 'Year', value: '2026' },
      { label: 'Sources', value: 'VoteHub, Wikipedia, FEC, Economist/YouGov' },
      { label: 'Built with', value: 'React, FastAPI, PostgreSQL' },
      { label: 'Status', value: 'Live ↗', href: 'https://news-site-aggregator.vercel.app/polls' },
    ],
    links: [{ label: 'Visit', href: 'https://news-site-aggregator.vercel.app/polls' }],
    image: {
      src: '/work/house-polling.jpg',
      alt: '2026 House polling page with approval tracking and a hex cartogram of all 435 districts',
      caption: 'The polling page, with the district cartogram below the national numbers.',
    },
    sections: [
      {
        id: 'why',
        title: 'Why I built it',
        blocks: [
          {
            type: 'p',
            text: 'I wanted to see whether scattered public polling on the 2026 midterms could be pulled into one picture of where the House was heading. The site stops short of a forecast and leaves that call to the reader. Building it changed how I saw public data: there is far more of it than I expected, and Claude can extract it well. The hard part is keeping it comparable. Redistricting redrew district lines between 2024 and 2026, so the baseline behind every comparison had to be rebuilt. That lesson shaped every project that followed.',
          },
        ],
        note: 'Every district is drawn the same size and colored by its 2024 presidential lean.',
      },
      {
        id: 'how',
        title: 'How it works',
        blocks: [
          {
            type: 'list',
            items: [
              {
                lead: 'Map.',
                text: 'All 435 districts as an equal-size hex cartogram. Click any district for its candidates and fundraising.',
              },
              {
                lead: 'District polls.',
                text: "Two streams: Wikipedia's 2026 House pages for all 50 states, and VoteHub's district polls.",
              },
              {
                lead: 'Matching.',
                text: "Candidates are matched to FEC records by name, never by a feed's own party label. Ambiguous matches are skipped, not guessed.",
              },
              {
                lead: 'National picture.',
                text: 'Approval and generic-ballot averages from VoteHub, weekly Economist/YouGov crosstabs, and market-implied control of Congress from Kalshi and Polymarket.',
              },
            ],
          },
        ],
      },
      {
        id: 'bug',
        title: 'A bug worth telling',
        blocks: [
          {
            type: 'p',
            text: "In July 2026, the site's own House model gave Democrats a 36% chance of winning control while Kalshi's market gave them 83%. The model had silently fallen back to a 2024 baseline with no live polling in it.",
          },
          {
            type: 'p',
            text: "The fix was a three-step fallback, from live polling to a stored polling aggregate to the 2024 baseline, plus a label on the model card that says which one it's using.",
          },
        ],
        note: 'The model card now warns readers whenever it falls back to the 2024 baseline.',
      },
      WHAT_I_LEARNED,
    ],
  },
  {
    slug: 'situation-monitor',
    no: '04',
    title: 'Situation Monitor',
    field: 'News',
    year: '2026',
    summary:
      'A live dashboard of what is happening right now: trending topics, hazards, weather alerts, prediction markets and internet outages, with AI summaries.',
    deck: 'What is the internet paying attention to right now? A live dashboard built from the most-trafficked public signals.',
    stack: 'FastAPI · React · PostgreSQL · APScheduler · Groq',
    meta: [
      { label: 'Role', value: 'Solo project' },
      { label: 'Year', value: '2026' },
      { label: 'Sources', value: '20+ public feeds' },
      { label: 'Built with', value: 'FastAPI, React, PostgreSQL, Groq' },
      { label: 'Status', value: 'Live ↗', href: 'https://news-site-aggregator.vercel.app/' },
    ],
    links: [{ label: 'Visit', href: 'https://news-site-aggregator.vercel.app/' }],
    image: {
      src: '/work/situation-monitor.jpg',
      alt: 'Situation Monitor dashboard with trending topics, polling, markets, hazards and weather',
      caption: 'The dashboard on November 25, 2026.',
    },
    sections: [
      {
        id: 'why',
        title: 'Why I built it',
        blocks: [
          {
            type: 'p',
            text: 'Situation Monitor asks a simple question: what is the internet paying attention to right now? It pulls the most-trafficked public signals, from Google Trends and Wikipedia page views to Reddit, onto one screen. I built it early in my work with Claude, and it showed me that the question itself is moving. LLMs are changing how trending topics get measured, and even where people discuss them.',
          },
        ],
        note: 'Feeds refresh on their own clocks, from every 5 minutes for earthquakes to every 6 hours for natural events.',
      },
      {
        id: 'reads',
        title: 'What it reads',
        blocks: [
          {
            type: 'list',
            items: [
              { lead: 'Attention.', text: 'Google Trends, Wikipedia page views, Reddit and the New York Times.' },
              { lead: 'News.', text: 'GDELT, Google News and NewsAPI.' },
              {
                lead: 'Hazards and nature.',
                text: "USGS earthquakes, FAA airport delays, National Weather Service alerts, Open-Meteo and NASA's natural-event tracker.",
              },
              { lead: 'Markets.', text: 'Kalshi and Polymarket.' },
              { lead: 'Internet.', text: 'Status pages for 13 major online services.' },
            ],
          },
          {
            type: 'p',
            text: 'Every source follows one pattern: fetch on a schedule, store, serve through an API. Groq writes the summaries.',
          },
        ],
      },
      {
        id: 'run',
        title: 'How it is run',
        blocks: [
          {
            type: 'list',
            items: [
              {
                lead: 'Specs first.',
                text: 'Every feature starts as four documents planned with Claude: a feature plan, acceptance criteria, an implementation plan and test cases.',
              },
              { lead: 'Tests and CI.', text: 'Every change runs the test suite before it merges.' },
              {
                lead: 'Source health.',
                text: 'Each scheduled job records whether its last run worked, so a feed that quietly stops shows up on a status page.',
              },
              {
                lead: 'Boundaries.',
                text: 'A test fails the build if the elections code and the monitor code start depending on each other, which keeps the polling site ready to become its own app.',
              },
            ],
          },
        ],
      },
      WHAT_I_LEARNED,
    ],
  },
  {
    slug: 'project-oracle',
    no: '05',
    title: 'Project Oracle',
    field: 'Workflow',
    year: '2026',
    summary:
      'A Claude-powered product workflow that keeps one shared record of a project and hands it straight to engineering.',
    deck: 'What if every team on a project worked from the same record? A Claude-powered workflow for product managers.',
    stack: 'Claude · Jira · Confluence',
    meta: [
      { label: 'Role', value: 'Product manager' },
      { label: 'Year', value: '2026' },
      { label: 'Built with', value: 'Claude, Jira, Confluence' },
      { label: 'Status', value: 'Internal tool' },
    ],
    links: [],
    sections: [
      {
        id: 'why',
        title: 'Why I built it',
        blocks: [
          {
            type: 'p',
            text: "On most projects, the PM is the only person holding the whole picture. Every stakeholder's needs pass through them, and they rewrite that picture into specs, updates and tickets for each team along the way. Project Oracle replaces that relay with a shared record. The PM gathers everything a project learns in one place, Claude turns it into the collateral the team has agreed on, and that collateral passes straight to engineering to start development. Every team works from the same stream of information, from the first conversation to the first commit.",
          },
        ],
      },
      {
        id: 'how',
        title: 'How it works',
        blocks: [
          {
            type: 'p',
            text: "Oracle is a six-step workflow built on Claude. It connects a project's shared record to Jira, Confluence and a code translation layer for engineering.",
          },
          { type: 'placeholder', text: '[THE SIX STEPS, ONE LINE EACH.]' },
        ],
      },
      {
        id: 'context',
        title: 'Context',
        blocks: [
          {
            type: 'list',
            items: [
              { lead: 'Deadline.', text: 'Built to a three-week demo deadline.' },
              { lead: 'Adoption.', text: 'The most developed AI adoption effort in my division.' },
              {
                lead: 'A related concept.',
                text: 'A feature availability assistant that answers plain-language questions about the product roadmap from Jira data.',
              },
            ],
          },
        ],
      },
      WHAT_I_LEARNED,
    ],
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
