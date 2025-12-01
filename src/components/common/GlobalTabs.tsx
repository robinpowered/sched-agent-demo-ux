

interface TabItem {
  value: string;
  label: string;
}

interface GlobalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  gap?: string; // Optional gap size (default: 32px)
  showBorder?: boolean; // Optional border display (default: true)
}

export function GlobalTabs({ tabs, activeTab, onTabChange, gap = '32px', showBorder = true }: GlobalTabsProps) {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" style={{ gap }}>
      {/* Bottom border line - thin gray border beneath tab bar */}
      {showBorder && (
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px bg-[#e5e5e5] pointer-events-none" />
      )}

      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className="box-border content-stretch flex gap-[12px] items-center justify-center px-0 py-[12px] relative shrink-0 cursor-pointer bg-transparent border-0 hover:opacity-80 transition-opacity"
          >
            {/* Active tab bottom border - thicker blue border */}
            {isActive && (
              <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2774c1] pointer-events-none" />
            )}
            <p
              className="leading-[22px] not-italic relative shrink-0 text-[#1c1c1c] text-[14px] text-nowrap whitespace-pre"
              style={{ fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}
            >
              {tab.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}
