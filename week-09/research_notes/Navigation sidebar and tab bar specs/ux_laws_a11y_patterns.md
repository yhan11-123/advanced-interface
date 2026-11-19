# UX laws, accessibility, and cross-system patterns for navigation sidebars (expanded/collapsed) and tab bars

Researched 2026-11-19. Pages marked **[fetched]** were read in full this session. Pages marked **[ref]** are well-established, stable definitions cited to their canonical URL but not re-fetched this session (re-check before quoting verbatim).

## (a) Which Laws of UX apply to navigation, and how

### Takeaway
Navigation design draws mainly on six laws: Hick's (fewer and grouped choices), Fitts's (big targets placed at the edge), Jakob's (keep the conventional left or bottom placement), Miller's and chunking (sections with headers), common region and proximity (group headers and dividers), and Von Restorff (one clear selected state). Doherty and Tesler govern how collapsing feels and who carries the complexity.

### Cited Findings
- **Hick's Law** [fetched]: "The time it takes to make a decision increases with the number and complexity of choices." Its takeaways: minimise choices when response time matters, break complex tasks into steps, highlight recommended options, and "simplify carefully, without becoming too abstract." Hick and Hyman, 1952. [lawsofux.com/hicks-law](https://lawsofux.com/hicks-law/)
  - Navigation implication: keep the primary set short and group the long tail. NN/g advises showing mobile navigation visibly only when there are **4 or fewer** top-level links ([NN/g, Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/)). Carbon uses a left panel only when there are **more than 5** secondary items ([Carbon left panel usage](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/)).
- **Fitts's Law** [ref]: the time to reach a target depends on its distance and size. [lawsofux.com/fittss-law](https://lawsofux.com/fittss-law/)
  - Implication: make the whole sidebar row the hit area, not just the icon or text. Screen edges act as infinitely deep targets (a desktop rail docked flush left; a mobile tab bar at the bottom within thumb reach). Collapsing to icons shrinks the targets, so keep at least 24×24 px (WCAG 2.5.8, below).
  - NN/g supports the size point: text labels "enlarge click targets" compared with icon-only navigation ([NN/g vertical nav](https://www.nngroup.com/articles/vertical-nav/)).
- **Jakob's Law** [ref]: users spend most of their time on other sites, so they expect yours to work the same way. [lawsofux.com/jakobs-law](https://lawsofux.com/jakobs-law/)
  - Implication: put the sidebar on the left and the tab bar on the bottom on mobile, and mark the current item with a fill or bar.
  - NN/g: users look at the left half of the screen **80% of the time**, and are used to vertical navigation from Slack and Gmail. Avoid right-side navigation because of "right-rail blindness." [NN/g vertical nav](https://www.nngroup.com/articles/vertical-nav/)
- **Miller's Law / Chunking** [ref]: working memory holds about 7±2 items. Chunking groups information into meaningful units. [lawsofux.com/millers-law](https://lawsofux.com/millers-law/), [lawsofux.com/chunking](https://lawsofux.com/chunking/)
  - Implication: split long sidebars into named sections with category headers. Don't treat "7 items" as a hard cap; the law is about memory, not about scanning a list that stays visible.
- **Serial Position Effect** [ref]: users best remember the first and last items in a series. [lawsofux.com/serial-position-effect](https://lawsofux.com/serial-position-effect/)
  - Implication: put the most-used destinations at the top and utility items (Settings, Help, account) pinned at the bottom.
  - Fluent NavigationView has a separate footer area for Settings ([MS Learn NavigationView](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview)).
  - NN/g: put less important items at the bottom, because long menus fall below the fold ([NN/g vertical nav](https://www.nngroup.com/articles/vertical-nav/)).
- **Law of Common Region / Proximity / Similarity** [ref]: elements read as a group when they share an area with a clear boundary, sit close together, or look alike. [lawsofux.com/law-of-common-region](https://lawsofux.com/law-of-common-region/), [law-of-proximity](https://lawsofux.com/law-of-proximity/), [law-of-similarity](https://lawsofux.com/law-of-similarity/)
  - Implication: separate groups with a header, an extra gap, or a divider. All rows share one height and style (similarity), so the selected row stands out by contrast.
  - Fluent offers both NavigationViewItemHeader and NavigationViewItemSeparator, and a separator can be set to opacity 0 to "render the separator as space" (proximity) ([MS Learn](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview)).
  - Primer offers group headings and `NavList.Divider` ([Primer NavList](https://primer.style/product/components/nav-list/)).
- **Von Restorff Effect (isolation)** [ref]: the item that differs from the rest is the one remembered. [lawsofux.com/von-restorff-effect](https://lawsofux.com/von-restorff-effect/)
  - Implication: exactly one row looks selected. Badges and counters are also isolation cues, so use them sparingly or they compete with the selected state.
- **Doherty Threshold** [ref]: productivity rises when the system responds in under 400 ms. [lawsofux.com/doherty-threshold](https://lawsofux.com/doherty-threshold/)
  - Implication: collapse and expand, hover-to-peek, and tab switches should finish well under 400 ms.
  - APG recommends automatic tab activation only when panels appear "without noticeable latency" ([APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)).
- **Tesler's Law (conservation of complexity)** [ref]: every system has complexity that cannot be removed, only moved. [lawsofux.com/teslers-law](https://lawsofux.com/teslers-law/)
  - Implication: a collapsed rail doesn't remove the labels' meaning; it shifts the work to the user (recognising icons, or hovering for tooltips). The system should absorb that cost: tooltips, automatic collapse by breakpoint, and remembered state.

### Inferences
- A defensible tab bar is 3–5 items. This is an inference from NN/g's "4 or fewer visible" rule and Hick's Law; Material's 3–5 guidance could not be fetched (see Gaps).
- A sidebar can hold many more items (NN/g cites a site with 13 top-level categories) as long as they are chunked under headers.
- Collapsing trades Fitts (smaller targets) and Tesler (meaning moves to the user) for content space. Justify it with a breakpoint or a user toggle, not as the default.

### Gaps
- The userinterface.wiki laws-of-ux page was not fetched (tool budget). Laws other than Hick's are cited from stable lawsofux.com definitions without re-reading.

## (b) NN/g findings on navigation

### Takeaway
On desktop, visible navigation clearly beats hidden navigation. Hidden navigation cut discoverability by more than 20% and made tasks at least 39% slower. Icons need visible text labels, and a hover-only label doesn't count.

### Cited Findings
- **Study**: 179 participants, 6 live sites, desktop and mobile, run remotely. Published 2016-06-26. [NN/g Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/)
  - **Navigation used**: desktop hidden 27% vs visible 48% vs combo 50%. Mobile hidden 57% vs combo 86%.
  - **Discoverability**: hidden navigation was more than 20% lower on both devices, with a larger drop on desktop.
  - **Task time**: on desktop, hidden was at least 39% slower than visible or combo. On mobile, hidden was 15% slower than combo.
  - **Perceived difficulty** (1–7 scale): hidden 2.6, combo 2.3, visible 2.1.
  - **Recommendations**: on desktop, avoid hidden navigation. On mobile, show links visibly if there are 4 or fewer, otherwise hide some and support them with in-page links.
- **Left-side vertical nav** (Laubheimer, 2021-05-16). [NN/g vertical nav](https://www.nngroup.com/articles/vertical-nav/)
  - It suits broad or growing information architectures, and new items can be added without a redesign.
  - Vertical lists are scanned more efficiently than horizontal ones.
  - Left-align labels and front-load keywords. Centred labels create a jagged edge.
  - It lowers the content-to-chrome ratio. In one example the ratio went from about 5:1 to 12:1 after switching to horizontal.
  - Don't hide desktop navigation behind a hamburger.
  - Don't rely on icons alone; icon-only navigation is not recommended for sites with occasional visitors.
- **Icon usability** (Harley, 2014-07-27). [NN/g Icon Usability](https://www.nngroup.com/articles/icon-usability/)
  - Labels should be visible at all times. Hover-only labels add interaction cost and fail on touch.
  - Only a few icons are near-universal: home, print, search.
  - 5-second rule: if a fitting icon takes more than 5 seconds to think of, it won't communicate the meaning.
  - A clock icon used for history went unclicked by every participant.

### Inferences
- A collapsed icon-only rail is a "partially hidden" state. NN/g's data argues for expanded by default on desktop, with collapse as a user choice for expert or repeat users (for example, power-user tools like Linear or Figma).
- In the collapsed state, give tooltips plus the active indicator. Tooltips are a fallback, not a replacement for labels.

### Gaps
- No NN/g article specifically on mobile tab bars or badges was fetched. The NN/g "Tab Bars" and "Indicators, Validations, Notifications" articles would be the next sources.

## (c) Accessibility and keyboard patterns

### Takeaway
A sidebar is a `<nav>` landmark of links, with `aria-current="page"` on the current one, operated with Tab. It is not a menu and not a tablist. Tabs (`role=tablist`/`tab` with `aria-selected`) are only for switching panels in place, operated with arrow keys and a roving focus. The collapse toggle is a disclosure button with `aria-expanded` and `aria-controls`.

### Cited Findings
- **Navigation disclosure pattern** [fetched]. [APG disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
  - Structure: a named `<nav>` landmark containing nested lists. Top-level toggles are buttons, and the destinations are plain links.
  - It explicitly "does not use the WAI-ARIA menu role," because site navigation doesn't need menu keyboard behaviour.
  - Toggles: `aria-expanded` true/false, plus `aria-controls` pointing at the controlled list. The CSS can style from the `[aria-expanded]` attribute.
  - Current item: `aria-current="page"` is set on the current link and moved when another link is activated.
  - Keys:
    - Tab / Shift+Tab move through items.
    - Enter or Space toggles or follows a link.
    - Escape closes an open group and returns focus to its button.
    - Arrow keys and Home/End are optional extras, not replacements for Tab.
- **Tabs pattern** [fetched]. [APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
  - Roles: `tablist` (labelled), `tab` with `aria-controls`, and `tabpanel` with `aria-labelledby`. `aria-selected=true` goes on the active tab only, and a vertical tablist sets `aria-orientation=vertical`.
  - Tab enters the list at the active tab, and the next Tab leaves it. Arrow keys move between tabs and wrap around, and Home/End are optional. This is roving tabindex in practice.
  - Automatic activation (on focus) only if panels load without noticeable latency; otherwise activate manually with Enter or Space.
- **Primer NavList**. [Primer NavList](https://primer.style/product/components/nav-list/)
  - Uses `aria-current="page"` for the current page and `"location"` for a section within the page.
  - `NavList.Heading` names the `<nav>` landmark and can be visually hidden.
  - A parent item with sub-items renders as a `<button>` (a toggle, not a link).
  - Nest at most 4 levels.
  - It warns that a TreeView is never an accessible replacement for navigation.
- **WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA** [fetched]. [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
  - Targets must be at least 24×24 CSS px.
  - Smaller targets pass if a 24 px circle centred on each one doesn't intersect another target or another target's circle.
  - Targets inline in text are exempt.
  - SC 2.5.5 (Enhanced) uses 44×44 px.
- **WCAG 1.4.11 Non-text Contrast (AA)** [ref]: the visual information needed to identify a UI component's state needs 3:1 against adjacent colours. This applies to the selected bar or fill, focus rings, and icon-only items. [W3C Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- **WCAG 2.4.7 Focus Visible (AA)** and **2.4.11 Focus Not Obscured (Minimum) (AA, new in 2.2)** [ref]: the focus indicator must be visible and not fully hidden, for example by an overlay sidebar or a sticky bar. [2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- **WCAG 1.4.13 Content on Hover or Focus (AA)** [ref]: tooltips on a collapsed rail must be dismissible (Esc), hoverable, and persistent. They should also appear on keyboard focus, not only on mouse hover. [1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- **WCAG 2.3.3 Animation from Interactions (AAA)** [ref]: motion triggered by interaction can be disabled. In practice, honour `prefers-reduced-motion` by swapping the width or slide for an instant change or a crossfade. [2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- **WCAG 1.4.1 Use of Color** [ref]: the selected state should not rely on colour alone. Add a bar, a weight change, or a fill shape. [1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)

### Inferences
- Sidebar → `nav` + links + `aria-current`.
- Mobile bottom "tab bar" that changes pages → still links with `aria-current` (it's navigation, despite the name).
- In-page segmented tabs → `tablist` + `aria-selected`.
- Mixing these up (for example `role=tab` on page links) is a common error.
- In the collapsed rail, every icon link still needs an accessible name. Use visually hidden label text rather than only a tooltip, so screen readers don't depend on hover.
- The collapse toggle's accessible name should stay stable (for example "Sidebar") while `aria-expanded` reports the state, or the name should switch to "Expand" or "Collapse" sidebar. Don't do both.
- Move focus sensibly: when a collapse hides a focused element, put focus on the toggle.

### Gaps
- The Carbon left-panel accessibility tab was not fetched. Fluent's keyboard specifics for NavigationView were not extracted.

## (d) Other systems: widths, rows, headers, trailing slots, states, motion

### Takeaway
The conventions converge: collapsed rail about 48 px (Carbon, Fluent desktop), expanded panel 256–320 px, rows 32–40 px, a 4 px left bar for selected, and group headers in small caps or small subdued text. Auto-collapse by breakpoint is around 640 px and 1008 px (Fluent). The collapse motion is fast; Carbon's width transition is 110 ms.

### Cited Findings
- **Microsoft Fluent / WinUI NavigationView**. [MS Learn NavigationView](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview)
  - Modes: Top, Left, LeftCompact (icons only; the opened pane overlays content), and LeftMinimal (menu button only).
  - In Auto mode:
    - **≥1008 px** shows the expanded Left pane.
    - **641–1007 px** shows LeftCompact.
    - **≤640 px** shows LeftMinimal.
  - The thresholds are configurable (`CompactModeThresholdWidth` defaults to 640; `ExpandedModeThresholdWidth`).
  - Grouping: NavigationViewItemHeader labels groups and NavigationViewItemSeparator divides them. The separator can be set to opacity 0 to act as plain space.
  - The page header has a fixed height of **52 px**.
  - Top navigation overflows into a "More" menu when narrow. The doc recommends switching from Top to LeftMinimal instead of collapsing everything into overflow.
  - Selectable parent items should not be used in LeftCompact.
  - (OpenPaneLength 320 / CompactPaneLength 48 are well-known WinUI defaults but were not seen in the fetched text; verify via the API reference.)
- **Fluent 2 web Nav**: 260 px wide by default, sitting in an inline drawer. It becomes an overlay drawer at 640 px. [Fluent 2 Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) (via search snippet; not fully fetched)
- **IBM Carbon UI shell left panel**. [Carbon style](https://carbondesignsystem.com/components/UI-shell-left-panel/style/), [Carbon usage](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/), [Carbon v10 _side-nav.scss](https://cdn.jsdelivr.net/npm/carbon-components@10.58.15/scss/components/ui-shell/_side-nav.scss)
  - **Size and typography**
    - Panel 256 px (16 rem). Link height 32 px with 16 px side padding.
    - Sub-menu items are 32 px high, indented 32 px.
    - Icons 16 px.
    - Type 14 px: links and sub-menu headers SemiBold 600, sub-items Regular 400.
  - **State tokens** (each state also switches text and icon colour to the primary tokens)
    - Enabled: `$text-secondary`.
    - Hover: `$background-hover`.
    - Active (pressed): `$background-active`.
    - Selected: `$background-selected` plus a **4 px** `$border-interactive` left bar.
    - Focus: a `$focus` border.
  - **Code (v10 SCSS)**
    - The rail is `mini-units(6)` = 48 px and expands to `mini-units(32)` = 256 px. Pixel conversion: mini-unit = 8 px, per search summary.
    - The rail expands on hover or focus.
    - Panel transition: **`width 0.11s cubic-bezier(0.2, 0, 1, 0.9)`**. A code comment says it is not yet synced with motion tokens.
    - Labels switch `opacity`/`visibility` with no transition declared.
    - Row colour changes use `$duration--fast-02` (70 ms in Carbon's motion tokens [ref]).
    - The selected marker is a 4 px `::before` bar.
    - A "large" item height of 48 px also exists.
  - **Usage**
    - Use the left panel for more than 5 secondary items.
    - No 3-tier navigation.
    - Sub-menus have a chevron and push items below them down.
- **GitHub Primer NavList**. [Primer NavList](https://primer.style/product/components/nav-list/)
  - Slots: a LeadingVisual (icon or avatar) and a **TrailingVisual** for auxiliary information such as an unread count or an external-link icon.
  - A **TrailingAction** (for example a pin) needs a `label` (its accessible name) and renders as an IconButton.
  - Group headings come from `title` or `GroupHeading`. Dividers serve visual-only sections.
  - `inactiveText` explains why an item is inactive.
- **Material 3 navigation rail** (unofficial source): the M3 Expressive collapsed rail is listed at **96**. The expanded rail ranges from **220 to 360**. [MICL README](https://app.unpkg.com/material-inspired-component-library@6.0.0/files/components/navigationrail/README.md). Conflicting value: 80 dp in a third-party spec ([koder](https://kds.koder.dev/es-ES/reference/components-navigation.html)), likely the pre-Expressive M3 rail.

### Inferences
- **Trailing slot convention**: count or badge (information) vs action button (pin, more, add) vs external-link icon (destination type).
  - Actions should reveal on hover or focus, but stay keyboard-reachable and have an accessible name (Primer `label`).
  - In the collapsed rail, trailing text has no room. Convert counts to a dot or small badge on the icon corner, and drop actions entirely.
- **State ladder** shared by Carbon and others: enabled (secondary text) → hover (subtle background) → pressed (stronger background) → selected (background plus a 4 px bar, primary text).
  - Focus is a separate ring, not a colour.
  - The selected state uses two cues (bar plus fill), which satisfies 1.4.1, and the bar needs 3:1 contrast (1.4.11).
- **Motion**: animate the panel width (or `transform: translateX` for an overlay) quickly, about 100–250 ms.
  - Clip labels with `overflow:hidden` and fade them out early on collapse and late on expand, so text never wraps mid-transition.
  - Animating `width` causes the content to reflow on each frame. An overlay (Fluent LeftCompact, Carbon hover-expand) avoids reflowing the content by floating over it.
  - Persist the user's collapsed or expanded choice (localStorage) separately from breakpoint-driven auto-collapse.
- **Products** (Linear, Notion, Slack, Figma): patterns such as hover-to-peek a collapsed sidebar, drag-to-resize, and remembering width are widely observed. They are not cited here (see Gaps).

### Gaps
- **Material 3**: the official m3.material.io pages (navigation rail and bar specs and guidelines) rendered empty through the fetch tool (they need JS). The rail and drawer widths, the 3–5 destination rule, and badge sizes are unverified from the primary source.
- **Atlassian and Shopify Polaris**: navigation and sidebar specs were not fetched (tool budget).
- **Linear, Notion, Slack, Figma**: no primary sources were found or fetched for sidebar widths, resize limits, peek behaviour, or animation timings. Measuring them in product (DevTools) would be needed.
- **Fluent 2**: no published compact-rail width for the web Nav was found. The WinUI 320/48 defaults were not confirmed in the fetched text.
- **Carbon v11**: the 48/256 px rail values come from v10 SCSS; a current v11 confirmation was not found. The 0.11 s width transition is also from v10.
- **Collapse/expand duration best practice (200–300 ms)**: no authoritative source was fetched. The only hard number found is Carbon's 110 ms.
