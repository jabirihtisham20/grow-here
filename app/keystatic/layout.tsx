import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grow Here Admin | Keystatic CMS',
  description: 'Editorial Admin Content Management System for Grow Here',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ background: '#061A14' }}
    >
      {/* ── Branded Admin Top Bar ── */}
      <header
        style={{
          background: 'linear-gradient(90deg, #04120D 0%, #061A14 40%, #071E18 100%)',
          borderBottom: '1px solid rgba(22, 75, 56, 0.6)',
          boxShadow: '0 1px 20px rgba(0,0,0,0.5)',
          flexShrink: 0,
          zIndex: 10,
        }}
        className="flex items-center justify-between px-4 sm:px-6 py-3"
      >
        {/* Logo mark + wordmark */}
        <div className="flex items-center gap-3 select-none">
          {/* Inline SVG Mark */}
          <div style={{ width: 34, height: 34, flexShrink: 0 }}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <rect x="7" y="7" width="86" height="86" rx="24" ry="24" stroke="#FAF7F2" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 44 26 C 41 24.5 37 23.5 32.5 23.5 C 20.5 23.5 14 33.5 14 50 C 14 66.5 21 76.5 32.5 76.5 C 38 76.5 42.5 74.5 45.5 71.5" stroke="#FAF7F2" strokeWidth="5.2" strokeLinecap="round" />
              <path d="M 43 23 L 45 28" stroke="#FAF7F2" strokeWidth="3" strokeLinecap="round" />
              <path d="M 45 56 L 45 72" stroke="#FAF7F2" strokeWidth="4.8" strokeLinecap="round" />
              <path d="M 34 56 L 47 56" stroke="#FAF7F2" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 48 37 L 48 76" stroke="#FAF7F2" strokeWidth="4.8" strokeLinecap="round" />
              <path d="M 45 37 L 51 37" stroke="#FAF7F2" strokeWidth="3" strokeLinecap="round" />
              <path d="M 45 76 L 51 76" stroke="#FAF7F2" strokeWidth="3" strokeLinecap="round" />
              <path d="M 48 56 L 68 56" stroke="#FAF7F2" strokeWidth="4" strokeLinecap="round" />
              <path d="M 68 28 L 68 76" stroke="#FAF7F2" strokeWidth="5" strokeLinecap="round" />
              <path d="M 64 28 L 73 28" stroke="#FAF7F2" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 63 76 L 74 76" stroke="#FAF7F2" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 57 53 C 58 45 64 34 76 26 C 76 36 71 45 61 51 Z" fill="#7C9A82" />
              <path d="M 56 54 Q 65 42 75 27" stroke="#FAF7F2" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          {/* Divider */}
          <div
            className="hidden sm:block"
            style={{ width: 1, height: 28, background: 'rgba(246,243,234,0.2)', flexShrink: 0 }}
          />

          {/* Brand text */}
          <div className="hidden sm:flex flex-col justify-center">
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                letterSpacing: '0.28em',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#FAF9F5',
                lineHeight: 1,
              }}
            >
              GROWHERE
            </span>
            <span
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontStyle: 'italic',
                fontSize: 10,
                letterSpacing: '0.06em',
                color: '#9DB0A3',
                marginTop: 4,
                lineHeight: 1,
              }}
            >
              Editorial Admin
            </span>
          </div>
        </div>

        {/* Centre status badge */}
        <div
          className="hidden md:flex items-center gap-2"
          style={{
            background: 'rgba(22,75,56,0.35)',
            border: '1px solid rgba(64,163,122,0.25)',
            borderRadius: 999,
            padding: '4px 14px',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#79A96B',
              boxShadow: '0 0 6px rgba(121,169,107,0.7)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#A7C99B',
              textTransform: 'uppercase',
            }}
          >
            Content Studio
          </span>
        </div>

        {/* Right: back to site link */}
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 999,
            background: 'rgba(232,199,90,0.1)',
            border: '1px solid rgba(232,199,90,0.3)',
            color: '#E8C75A',
            textDecoration: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back to Site</span>
        </a>
      </header>

      {/* ── Keystatic App Container with CSS Theme Overrides ── */}
      <div className="flex-1 overflow-auto" style={{ position: 'relative' }}>
        <style>{`
          /* ── Keystatic Admin Theme: Grow Here Botanical Dark ── */

          /* Root backgrounds */
          body, #__next, [data-keystatic-root] {
            background: #061A14 !important;
            color: #F6F3EA !important;
          }

          /* Sidebar / aside */
          aside, nav[role="navigation"],
          [class*="sidebar"], [class*="Sidebar"],
          [class*="AppShellSidebar"] {
            background: #04120D !important;
            border-right: 1px solid rgba(22,75,56,0.5) !important;
            color: #F6F3EA !important;
          }

          /* Main content panels */
          main, [class*="AppShellContent"],
          [class*="main-content"] {
            background: #061A14 !important;
            color: #F6F3EA !important;
          }

          /* White / light backgrounds → dark */
          div, section, article, form, fieldset, li, ul, ol {
            background-color: transparent;
          }

          /* Explicit white overrides */
          [style*="background: white"],
          [style*="background-color: white"],
          [style*="background: #fff"],
          [style*="background-color: #fff"],
          [style*="background:#fff"],
          [style*="background: rgb(255, 255, 255)"],
          [style*="background-color: rgb(255, 255, 255)"] {
            background: #061A14 !important;
            background-color: #061A14 !important;
          }

          /* Cards */
          [class*="Card"], [class*="card"],
          [class*="Panel"], [class*="panel"],
          [class*="Surface"], [class*="surface"],
          [class*="Box"][class*="rounded"],
          [class*="paper"], [class*="Paper"] {
            background: #0A241B !important;
            border: 1px solid rgba(22,75,56,0.35) !important;
            color: #F6F3EA !important;
          }

          /* Inputs */
          input[type="text"],
          input[type="email"],
          input[type="password"],
          input[type="search"],
          input[type="url"],
          input[type="date"],
          textarea, select {
            background: #071E18 !important;
            border: 1px solid rgba(22,75,56,0.6) !important;
            color: #F6F3EA !important;
            border-radius: 6px !important;
            caret-color: #E8C75A !important;
          }
          input::placeholder, textarea::placeholder {
            color: #9DB0A3 !important;
            opacity: 1 !important;
          }
          input:focus, textarea:focus, select:focus {
            border-color: rgba(64,163,122,0.7) !important;
            box-shadow: 0 0 0 3px rgba(64,163,122,0.12) !important;
            outline: none !important;
          }

          /* Buttons */
          button {
            font-family: 'Inter', system-ui, sans-serif !important;
          }
          button[type="submit"],
          [class*="Button--primary"],
          [class*="button--primary"],
          [data-variant="primary"] {
            background: #1D6548 !important;
            color: #FAF9F5 !important;
            border: none !important;
          }
          button[type="submit"]:hover,
          [class*="Button--primary"]:hover {
            background: #2A8662 !important;
          }

          /* Links */
          a:not([style*="color"]) {
            color: #79A96B;
            text-decoration: none;
          }
          a:not([style*="color"]):hover {
            color: #E8C75A;
          }

          /* Active / selected nav items */
          [aria-current="page"],
          [aria-selected="true"],
          [data-selected="true"],
          [class*="active"],
          [class*="selected"] {
            background: rgba(22,75,56,0.45) !important;
            color: #E8C75A !important;
            border-radius: 6px !important;
          }

          /* Dividers */
          hr, [class*="Divider"], [class*="divider"],
          [class*="separator"], [class*="Separator"] {
            border-color: rgba(22,75,56,0.4) !important;
          }

          /* Labels */
          label, [class*="Label"], [class*="label"] {
            color: #9DB0A3 !important;
            font-size: 0.78rem !important;
            letter-spacing: 0.04em !important;
          }

          /* Headings */
          h1, h2, h3, h4, h5, h6 {
            color: #FAF9F5 !important;
          }

          /* Paragraphs / body text */
          p, span, li, td, th {
            color: #F6F3EA;
          }

          /* Muted / secondary text */
          [class*="muted"], [class*="secondary"],
          [class*="subtle"], [class*="hint"] {
            color: #9DB0A3 !important;
          }

          /* Tables */
          table {
            border-color: rgba(22,75,56,0.3) !important;
          }
          thead, th {
            background: #04120D !important;
            color: #9DB0A3 !important;
          }
          tbody tr:nth-child(even) {
            background: rgba(10,36,27,0.4) !important;
          }
          td {
            border-color: rgba(22,75,56,0.25) !important;
          }

          /* Code blocks */
          pre, code, [class*="CodeEditor"] {
            background: #04120D !important;
            border: 1px solid rgba(22,75,56,0.4) !important;
            color: #A7C99B !important;
            border-radius: 6px !important;
          }

          /* Badges / tags / chips */
          [class*="Badge"], [class*="badge"],
          [class*="Tag"], [class*="tag"],
          [class*="Chip"], [class*="chip"] {
            background: rgba(22,75,56,0.5) !important;
            color: #A7C99B !important;
            border-color: rgba(64,163,122,0.2) !important;
          }

          /* Modals and dialogs */
          [role="dialog"],
          [class*="Dialog"], [class*="dialog"],
          [class*="Modal"], [class*="modal"] {
            background: #0A241B !important;
            border: 1px solid rgba(22,75,56,0.5) !important;
            box-shadow: 0 25px 60px rgba(0,0,0,0.7) !important;
            color: #F6F3EA !important;
          }

          /* Overlay backdrop */
          [class*="Overlay"], [class*="overlay"],
          [class*="backdrop"], [class*="Backdrop"] {
            background: rgba(4,18,13,0.8) !important;
            backdrop-filter: blur(4px) !important;
          }

          /* Drop zones */
          [class*="DropZone"], [class*="dropzone"],
          [class*="FileInput"], [class*="upload"] {
            background: #071E18 !important;
            border: 2px dashed rgba(64,163,122,0.35) !important;
            color: #9DB0A3 !important;
          }

          /* Toasts / alerts */
          [class*="Toast"], [class*="toast"],
          [class*="Alert"], [class*="alert"],
          [class*="Notification"] {
            background: #0E2E23 !important;
            border: 1px solid rgba(64,163,122,0.3) !important;
            color: #F6F3EA !important;
          }

          /* Checkboxes / radios */
          input[type="checkbox"],
          input[type="radio"] {
            accent-color: #79A96B !important;
          }

          /* Scrollbars */
          *::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          *::-webkit-scrollbar-track {
            background: #04120D;
          }
          *::-webkit-scrollbar-thumb {
            background: #164B38;
            border-radius: 3px;
          }
          *::-webkit-scrollbar-thumb:hover {
            background: #1D6548;
          }

          /* Selection highlight */
          ::selection {
            background: rgba(232,199,90,0.25) !important;
            color: #FAF9F5 !important;
          }

          /* Tooltip */
          [role="tooltip"],
          [class*="Tooltip"], [class*="tooltip"] {
            background: #0E2E23 !important;
            color: #F6F3EA !important;
            border: 1px solid rgba(64,163,122,0.3) !important;
          }
        `}</style>

        {children}
      </div>

      {/* ── Subtle Branded Footer Bar ── */}
      <footer
        style={{
          background: '#04120D',
          borderTop: '1px solid rgba(22,75,56,0.4)',
          flexShrink: 0,
          padding: '7px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11,
            color: '#9DB0A3',
            letterSpacing: '0.04em',
          }}
        >
          Grow Here · Editorial Admin · Content Studio
        </span>
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11,
            color: 'rgba(157,176,163,0.45)',
            letterSpacing: '0.04em',
          }}
        >
          Powered by Keystatic
        </span>
      </footer>
    </div>
  );
}
