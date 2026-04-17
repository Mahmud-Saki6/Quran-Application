"use client";

import { useSettings } from "@/context/SettingsContext";
import ThemeToggle from "@/app/components/ThemeToggle";

const fontOptions = [
  { label: "Traditional Arabic", value: "Scheherazade New" },
  { label: "Simple Arabic", value: "Amiri" },
  { label: "Uthmanic", value: "Noto Naskh Arabic" },
] as const;

const pronunciationModes = [
  { label: "Click", value: "click" },
  { label: "Hover", value: "hover" },
  { label: "Both", value: "click-and-hover" },
] as const;

const pronunciationSpeeds = [
  { label: "0.5x", value: 0.5 },
  { label: "0.7x", value: 0.7 },
  { label: "0.8x", value: 0.8 },
  { label: "1.0x", value: 1.0 },
  { label: "1.2x", value: 1.2 },
] as const;

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "14px",
      padding: "18px",
      transition: "border-color 0.2s ease",
    }}
  >
    {children}
  </div>
);

const SettingsSidebar = () => {
  const { closeSidebar, isSidebarOpen, resetSettings, settings, updateSettings } =
    useSettings();

  return (
    <>
      {/* Backdrop */}
      <button
        aria-hidden={!isSidebarOpen}
        aria-label="Close settings"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "var(--backdrop-scrim)",
          border: "none",
          cursor: "default",
          transition: "opacity 0.3s ease",
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? "auto" : "none",
        }}
        tabIndex={isSidebarOpen ? 0 : -1}
        type="button"
        onClick={closeSidebar}
      />

      {/* Sidebar panel */}
      <aside
        aria-hidden={!isSidebarOpen}
        aria-label="Reader settings"
        className="fixed right-0 top-0 z-50 h-full w-full sm:w-80 lg:w-96"
        style={{
          background: "var(--sidebar-bg)",
          borderLeft: "1px solid var(--border-subtle)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "var(--sidebar-shadow)",
          padding: "20px",
          overflowY: "auto",
          transition: "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "100%" }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Reader Settings
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                Personalise your reading experience.
              </p>
            </div>
            <button
              aria-label="Close settings sidebar"
              className="glass-button"
              style={{ flexShrink: 0 }}
              type="button"
              onClick={closeSidebar}
            >
              Close
            </button>
          </div>

          <ThemeToggle />

          {/* Arabic Font */}
          <SectionCard>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                margin: "0 0 12px",
              }}
            >
              Arabic Font
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {fontOptions.map((option) => {
                const isSelected = settings.arabicFont === option.value;
                return (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: isSelected
                        ? "var(--sacred-gold-dim)"
                        : "var(--bg-card)",
                      border: `1.5px solid ${
                        isSelected
                          ? "var(--tone-gold-border)"
                          : "var(--border-subtle)"
                      }`,
                      transition: "background 0.2s ease, border-color 0.2s ease",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      minHeight: "44px",
                    }}
                  >
                    <input
                      checked={isSelected}
                      name="arabic-font"
                      style={{
                        accentColor: "var(--accent-teal)",
                        width: "15px",
                        height: "15px",
                        flexShrink: 0,
                      }}
                      type="radio"
                      value={option.value}
                      onChange={() => updateSettings({ arabicFont: option.value })}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </SectionCard>

          {/* Arabic Font Size */}
          <SectionCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  margin: 0,
                }}
              >
                Arabic Font Size
              </p>
              <span className="badge-gold">{settings.arabicFontSize}px</span>
            </div>
            <input
              aria-label="Arabic font size"
              max={40}
              min={16}
              step={2}
              style={{
                width: "100%",
                accentColor: "var(--accent-teal)",
                cursor: "pointer",
                height: "44px",
              }}
              type="range"
              value={settings.arabicFontSize}
              onChange={(e) =>
                updateSettings({ arabicFontSize: Number(e.target.value) })
              }
            />
            {/* Size preview */}
            <p
              style={{
                direction: "rtl",
                textAlign: "right",
                fontFamily: settings.arabicFont,
                fontSize: `${settings.arabicFontSize}px`,
                color: "var(--text-primary)",
                marginTop: "10px",
                lineHeight: 1.8,
                opacity: 0.7,
              }}
            >
              بِسْمِ اللَّهِ
            </p>
          </SectionCard>

          {/* Translation Font Size */}
          <SectionCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  margin: 0,
                }}
              >
                Translation Size
              </p>
              <span className="badge-green">{settings.translationFontSize}px</span>
            </div>
            <input
              aria-label="Translation font size"
              max={28}
              min={12}
              step={2}
              style={{
                width: "100%",
                accentColor: "var(--sacred-green)",
                cursor: "pointer",
                height: "44px",
              }}
              type="range"
              value={settings.translationFontSize}
              onChange={(e) =>
                updateSettings({ translationFontSize: Number(e.target.value) })
              }
            />
            {/* Size preview */}
            <p
              style={{
                fontSize: `${settings.translationFontSize}px`,
                color: "var(--text-secondary)",
                marginTop: "10px",
                lineHeight: 1.6,
                opacity: 0.7,
              }}
            >
              In the name of Allah, the Most Gracious…
            </p>
          </SectionCard>

          {/* Pronunciation */}
          <SectionCard>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                margin: "0 0 12px",
              }}
            >
              Pronunciation
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    margin: "0 0 10px",
                  }}
                >
                  Trigger mode
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {pronunciationModes.map((mode) => {
                    const isActive = settings.pronunciationMode === mode.value;
                    return (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => updateSettings({ pronunciationMode: mode.value })}
                        style={{
                          minHeight: "38px",
                          padding: "0 12px",
                          borderRadius: "10px",
                          border: `1px solid ${
                            isActive ? "var(--tone-gold-border)" : "var(--border-subtle)"
                          }`,
                          background: isActive ? "var(--sacred-gold-dim)" : "var(--bg-card)",
                          color: isActive ? "var(--sacred-gold)" : "var(--text-secondary)",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                          transition: "background 0.2s ease, border-color 0.2s ease",
                        }}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    checked={settings.arabicPronunciationEnabled}
                    type="checkbox"
                    onChange={(e) =>
                      updateSettings({ arabicPronunciationEnabled: e.target.checked })
                    }
                  />
                  Arabic word pronunciation
                </label>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    margin: "0 0 10px",
                  }}
                >
                  Playback speed
                </p>
                <select
                  aria-label="Pronunciation speed"
                  value={settings.pronunciationSpeed}
                  onChange={(e) =>
                    updateSettings({ pronunciationSpeed: Number(e.target.value) })
                  }
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    background: "var(--menu-bg)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)",
                    padding: "0 12px",
                    cursor: "pointer",
                  }}
                >
                  {pronunciationSpeeds.map((speed) => (
                    <option key={speed.value} value={speed.value}>
                      {speed.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Reset */}
          <button
            className="glass-button"
            style={{
              marginTop: "auto",
              width: "100%",
              height: "44px",
              color: "var(--sacred-ruby)",
              borderColor: "var(--tone-ruby-border)",
            }}
            type="button"
            onClick={resetSettings}
          >
            Reset to Defaults
          </button>
        </div>
      </aside>
    </>
  );
};

export default SettingsSidebar;