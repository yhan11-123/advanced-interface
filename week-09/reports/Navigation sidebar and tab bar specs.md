# Five systems converge on one navigation grammar

Every major design system describes the same two objects. The first is a **vertical list of destinations that can shrink to an icon column**: a sidebar, rail or drawer. The second is a **short horizontal row of 3–5 icon-plus-label tabs**. They mostly disagree on how much they will tell you. Material Design 3 gives the hard numbers through its Compose token files:

- **80dp baseline bar / 64dp Expressive bar**
- **96dp collapsed rail expanding to 220–360dp**
- **360dp drawer**, now deprecated in favor of the expanded rail
- **56×32dp pill indicator**
- **6dp / 16dp badges**
- **hover 8%, focus 10%, pressed 10%** state layers
- named spring values for every motion

Apple's iOS 26 Liquid Glass HIG has gone the other way. It **removed its old metrics tables** (the 24/28/32 pt macOS sidebar rows and the tab icon sizes). It now describes behavior instead: a floating glass tab bar that minimizes on scroll, a trailing search tab, a sidebar that floats as an inset glass panel, and **no disabled tab state, ever**. Carbon, Fluent and Primer fill in the desktop web conventions: a **48 px collapsed rail, 256–320 px expanded panel, 32–40 px rows, a 4 px selected bar, a trailing slot for counts or actions**, and auto-collapse at **640 / 1008 px**.

For accessibility, the sources split the two jobs cleanly. **Page navigation is a `<nav>` of links with `aria-current="page"`.** **In-place view switching is a `tablist` with `aria-selected`** and arrow keys. Every target must be at least **24×24 px (WCAG 2.5.8)**, with 44 pt / 48dp as the platform defaults. The governing UX laws are Hick's, Fitts's, Jakob's, chunking/common region, Von Restorff, Doherty and Tesler. Together they make the case that a collapsed rail is a trade, not a default.

## Material 3 publishes the only complete numeric spec, and it is 96 → 220–360dp

Material's web guidelines render only with JavaScript, so the numbers here come from the Jetpack Compose Material3 token files and Material Components for Android (MDC) docs. Both are generated from Google's design-token pipeline, which makes them primary-grade sources.

**The navigation bar** comes in two heights. The baseline bar is **80dp tall** (`TallContainerHeight`). The M3 Expressive "short" bar is **64dp**, on `SurfaceContainer` at elevation Level2 with no corner rounding ([NavigationBarTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt)). MDC records the Expressive changes: **height 80 → 64dp**, top padding 12 → 6dp, bottom padding 16 → 6dp, the selected label is no longer bold, and the active label color moves to `Secondary` ([MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)).

In compact windows each item is **vertical**: a **24dp icon** inside a **56×32dp full-pill indicator**, which leaves 16dp of horizontal and 4dp of vertical padding around the icon, with a **4dp gap** to a `LabelMedium` label ([NavigationBarVerticalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarVerticalItemTokens.kt)). At **≥600dp** the Expressive bar switches to **horizontal** items: icon beside label, a **40dp-tall** pill with 16dp leading and trailing space, and 4dp between icon and label ([NavigationBarHorizontalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarHorizontalItemTokens.kt)). MDC lists this horizontal indicator as 56dp instead. That number matches the rail's horizontal item, so the doc text appears to be shared between the two components; trust the 40dp token. The bar holds **3 to 5 destinations**, and `BottomNavigationView` refuses more than five ([MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)).

**The navigation rail** has two states in Expressive. Collapsed, it is **96dp wide** (the baseline narrow rail was 80dp), with 4dp between items and a 44dp top space ([NavigationRailCollapsedTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailCollapsedTokens.kt)). Expanded, it is **220dp minimum to 360dp maximum** ([NavigationRailExpandedTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailExpandedTokens.kt)).

- **Collapsed items** keep the bar's vertical anatomy: 56×32 pill, `LabelMedium`, 4dp icon–label gap ([NavigationRailVerticalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailVerticalItemTokens.kt)).
- **Expanded items** turn horizontal: a **56dp-tall** pill, 16dp leading space, **8dp** icon–label gap, and the larger `LabelLarge` ([NavigationRailHorizontalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailHorizontalItemTokens.kt)).
- **The header slot** at the top holds a menu button, FAB, Extended FAB or logo.
- **Item count**: collapsed shows **top-level items only (up to 7)**. Expanded shows **section headers (submenus) and optional dividers that exist only in the expanded state**. Recommended range: **3–7 destinations** ([MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)).
- **Two expanded types**:
  - Standard: pushes content and collapses back into the rail.
  - Modal: floats over a scrim on `SurfaceContainer`, Level2, `CornerLarge`.

**The navigation drawer** is **360dp wide**. Its items are **56dp-tall full pills 336dp wide**, which is 360 minus a 12dp inset on each side. Icons are 24dp, labels `LabelLarge`, and section headers `TitleSmall` in `OnSurfaceVariant`. The trailing "24"-style count is a large-badge label in `LabelLarge` / `OnSurfaceVariant` ([NavigationDrawerTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt)). Inside an item: 16dp start, 24dp end, and a **12dp spacer between icon, label and badge**; the minimum drawer width is 240dp ([NavigationDrawer.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationDrawer.kt)).

The drawer is **deprecated in M3 Expressive**. MDC states that "the expanded rail is intended to replace the navigation drawer" ([MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md); [9to5Google](https://9to5google.com/2025/05/14/material-3-expressive-navigation/)). Compose still ships all three drawer variants without deprecation annotations, so treat the drawer as "deprecated guidance, still available in code."

| Component | Container | Item / indicator | Icon | Label type | Items |
|---|---|---|---|---|---|
| Nav bar (baseline) | 80dp tall | 56×32 pill, vertical | 24dp | Label medium | 3–5 |
| Nav bar (Expressive) | 64dp tall | 56×32 vertical; 40dp-tall horizontal at ≥600dp | 24dp | Label medium | 3–5 |
| Rail, collapsed | 96dp wide (80 baseline) | 56×32 pill, 64dp min item height | 24dp | Label medium | up to 7 |
| Rail, expanded | 220–360dp | 56dp-tall pill, hugs content | 24dp | Label large | all + section headers |
| Drawer (deprecated) | 360dp | 336×56 pill | 24dp | Label large; headers Title small | many |

**Badges** have two sizes. The small one is a **6dp Error-colored dot**. The large one is **16dp tall** with `OnError` text in `LabelSmall`, for a number or a short word such as "99" or "New" ([BadgeTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/BadgeTokens.kt)). The drawer's trailing count is a different, quieter thing: plain text in the trailing slot, not a red badge.

## Apple trades numbers for behavior: floating glass, minimize on scroll, never disabled

The current HIG Sidebars and Tab bars pages both carry a June 8, 2026 change-log entry. Their most notable feature is what they no longer say. The macOS sidebar table used to give **24 / 28 / 32 pt rows** with 16 / 20 / 24 px icons and 11 / 13 / 15 pt text for the small, medium and large sizes, plus 17 pt horizontal cell spacing. It survives only in the 2024 archive ([HIG Sidebars, 2024 archive](https://web.archive.org/web/2024/https://developer.apple.com/design/human-interface-guidelines/sidebars)). The tab icon target sizes (**25×25 pt regular / 18×18 pt compact** for circular glyphs) are also gone ([HIG Tab bars, 2024 archive](https://web.archive.org/web/2024/https://developer.apple.com/design/human-interface-guidelines/tab-bars)). The live pages defer to the system component and to Apple Design Resources. These are still the best official Apple numbers for a prototype, but cite them as pre-26.

The widely repeated **49 pt** tab bar height (83 pt with the home indicator) is not Apple documentation ([Apple Developer Forums 796986](https://developer.apple.com/forums/thread/796986)). Apple publishes **no iOS 26 floating-bar height, corner radius, inset or label size**, and no minimize timing.

**Sidebars** are defined as a leading-edge list that lets people "navigate between areas of your app or top-level collections of content" ([HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)). In iOS, iPadOS and macOS 26 they "float above content in the Liquid Glass layer." Content scrolls beneath them, or extends under them with `backgroundExtensionEffect()`. They use the **regular** glass variant, meant for text-heavy surfaces ([HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials); [WWDC25-356](https://developer.apple.com/videos/play/wwdc2025/356/)). The structural rules:

- Use **no more than two levels of hierarchy**.
- Group with **disclosure controls** and short group labels.
- Use SF Symbols that take the **accent color** by default. Fixed colors are acceptable when used sparingly, such as Mail's yellow VIP.
- Let people customize the sidebar's contents and order.
- Don't put critical items at the bottom of a macOS sidebar, because windows often hide that edge.

Collapse has three triggers:

- the iPad **edge swipe**
- an explicit show/hide button or View-menu command
- **automatic collapse as the window narrows**, as Mail does

Apple says flatly: "Avoid hiding the sidebar by default" ([HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)). On iPhone and iPad it also advises "consider using a tab bar first." The `sidebarAdaptable` style gives a tab bar that converts to a sidebar, with a built-in button to switch, and it responds to rotation and resizing on its own.

**Tab bars** on iOS 26 float at the bottom on Liquid Glass "that allows content beneath to peek through" ([HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)).

- **Item structure**: a **filled SF Symbol above a one-word label** in compact widths, side by side in regular widths. The system generates the selected appearance, so no separate selected artwork is needed ([HIG Icons](https://developer.apple.com/design/human-interface-guidelines/icons)).
- **Item count**: Apple gives no fixed number. It says to use "the appropriate number," lets overflow become a **More** tab, and gives one figure: "five or fewer" default tabs on customizable iPad bars.
- **Badges**: "a red oval containing white text and either a number or an exclamation point," reserved for critical information.
- **Disabled state**: "Don't disable or hide tab bar buttons, even when their content is unavailable." Explain the empty state instead.

The Liquid Glass era added two behaviors. **Minimize on scroll** (`.tabBarMinimizeBehavior(.onScrollDown)`) shrinks the bar and moves an optional accessory, such as Music's MiniPlayer, inline. The bar re-expands on reverse scroll, a tab tap, or scrolling to the top ([WWDC25-323](https://developer.apple.com/videos/play/wwdc2025/323/)). A **search tab** at the trailing end comes in two styles. The **standard tab** opens a discovery landing page. The **separate button** focuses the field at once, and "a search field takes the place of the tab bar" ([HIG Search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields)). On iPad the tab bar moves near the top. On visionOS it is a vertical leading rail whose labels appear when looked at.

That gives a designer three tab bar states to choreograph: **expanded, minimized and search-active**.

## States follow one ladder, and only Material quantifies it

The systems share a state model. Its rungs are **enabled → hover → pressed → selected**, with **focus as a separate ring**. They differ in how each rung is drawn.

| State | Material 3 | Apple (iOS/iPadOS 26) | Carbon |
|---|---|---|---|
| Enabled | Icon/label `OnSurfaceVariant`, no indicator | System default | `$text-secondary` |
| Hover | 8% state layer (`OnSecondaryContainer`) on the pill; drawer label darkens to `OnSurface` | iPad pointer "highlight": a Liquid Glass shape materializes under the pointer | `$background-hover` |
| Pressed | 10% state layer | Not described in text | `$background-active` |
| Focus | 10% layer; drawer focus ring `Secondary` | Keyboard focus (tvOS: drop shadow) | `$focus` border |
| Selected | `SecondaryContainer` pill, `OnSecondaryContainer` icon, `Secondary` label (no bold in Expressive) | System-generated (filled symbol, tint) | `$background-selected` + **4 px** `$border-interactive` left bar |
| Disabled | Not tokenized | **Prohibited for tabs** | Not specified |

Sources for the Material column: [StateTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt), [NavigationRailColorTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailColorTokens.kt) and [NavigationDrawerTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt). Apple: [HIG Pointing devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices). Carbon: [Carbon style](https://carbondesignsystem.com/components/UI-shell-left-panel/style/).

One detail matters for prototyping. In Material, the **whole item is clickable, but only the indicator pill shows the ripple** ([NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt)). The hit area and the visual feedback area are deliberately different shapes.

Carbon's selected state carries **two cues, a fill and a 4 px bar**. That satisfies WCAG 1.4.1's rule against color-only state ([W3C 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)), and the bar needs **3:1 non-text contrast** ([W3C 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). Material's pill plus color change does the same job with shape instead of a bar.

### The desktop web systems fill in rows, headers and the trailing slot

**Carbon's** UI shell left panel is the most concrete web reference ([Carbon style](https://carbondesignsystem.com/components/UI-shell-left-panel/style/); [Carbon v10 SCSS](https://cdn.jsdelivr.net/npm/carbon-components@10.58.15/scss/components/ui-shell/_side-nav.scss)).

- **Panel**: **256 px** wide. The rail is **48 px** and expands on hover or focus. These values come from v10 SCSS; v11 was not confirmed.
- **Rows**: **32 px** links with 16 px side padding. Sub-items are indented 32 px, and a 48 px "large" row height exists.
- **Icons and type**: 16 px icons, 14 px type. Links and sub-menu headers are SemiBold 600; sub-items are Regular 400.
- **Usage**: Carbon reserves the left panel for **more than 5** secondary items and forbids three-tier navigation ([Carbon usage](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/)).

**Fluent's** WinUI NavigationView names four modes: Top, Left, LeftCompact (icons only, the pane overlays content when opened) and LeftMinimal (menu button only). In Auto mode it switches between them by width: **≥1008 px expanded, 641–1007 px compact, ≤640 px minimal**. It groups items with `NavigationViewItemHeader` and `NavigationViewItemSeparator`. A separator can be set to opacity 0 so it acts as plain space, and Settings lives in a dedicated footer ([MS Learn NavigationView](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview)). The often-quoted 320/48 px pane defaults were not confirmed in the fetched text. **Fluent 2 web Nav** defaults to **260 px** and becomes an overlay drawer at 640 px ([Fluent 2 Nav](https://fluent2.microsoft.design/components/web/react/core/nav/usage)).

**Primer's** NavList formalizes the **trailing slot** that the assignment asks about ([Primer NavList](https://primer.style/product/components/nav-list/)). It has three parts:

- a **LeadingVisual** (icon or avatar)
- a **TrailingVisual**, for passive information such as an unread count or an external-link icon
- a **TrailingAction**, for a verb such as pin. It renders as an IconButton and requires an accessible `label`.

Primer also provides group headings, `NavList.Divider`, and `inactiveText` to explain why an item is unavailable. That echoes Apple's "explain, don't disable."

Together these give a clear three-way taxonomy for the trailing slot: **information** (count or badge), **destination type** (external-link icon) and **action** (pin, add, more). Apple's 2024 HIG matched the action case: it put an Add (+) button on the trailing side of a sidebar group label.

When a rail collapses there is no room for trailing text. The consistent move is to **convert counts into a dot or small badge on the icon corner and drop trailing actions**. Material makes this concrete: the drawer's trailing `LabelLarge` count and the rail's corner badge are separate tokens.

## Collapse motion splits into springs (Material) and fast curves (Carbon)

Material specifies motion as **springs, defined by damping ratio and stiffness**, in two families. **Spatial** springs move position and size and may bounce. **Effects** springs change color and opacity and never bounce ([ExpressiveMotionTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt); [StandardMotionTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt)).

| Token | Expressive (damping / stiffness) | Standard | Used for |
|---|---|---|---|
| Fast spatial | 0.6 / 800 | 0.9 / 1400 | Indicator pill growing in; modal rail width |
| Default spatial | 0.8 / 380 | 0.9 / 700 | Standard rail width; item spacing 4→0dp; item height 64→48dp; drawer open |
| Default effects | 1.0 / 1600 | same | Icon/label color, indicator alpha, label fades |
| Fast effects | 1.0 / 3800 | same | Drawer close |

The component sources show how these are used ([NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt); [WideNavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt); [NavigationDrawer.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationDrawer.kt)):

- **Selection does not slide.** Each item's pill **fades in and scales out from the icon center** in place.
- **Rail expansion is a coordinated morph.** The container width springs from 96 to 220–360dp. At the same time, item spacing shrinks from 4 to 0dp, item minimum height drops from 64dp to the 48dp touch minimum, items turn from vertical to horizontal, and labels fade.
- **The drawer is deliberately asymmetric.** It opens on a bouncy spatial spring and **closes on a non-bouncing effects spring**: the entrance has personality, and the exit gets out of the way. The drag threshold is 50% of the width or 400dp/s.

Carbon is the opposite pole. Its panel animates `width 0.11s cubic-bezier(0.2, 0, 1, 0.9)`, a **110 ms** curve that a code comment admits is not yet synced with its motion tokens. Labels switch instantly with no transition, and row colors use a 70 ms token ([Carbon v10 SCSS](https://cdn.jsdelivr.net/npm/carbon-components@10.58.15/scss/components/ui-shell/_side-nav.scss)).

Apple publishes **no timing at all** for the sidebar or the tab bar minimize. Its motion lives inside the system components.

Practical rules that follow from these sources:

- **Animating `width` reflows content on every frame.** Fluent's LeftCompact and Carbon's hover-expand avoid this by overlaying the content instead of pushing it. Material makes the same split with its standard and modal rails.
- **Clip labels during the transition.** Fade them out early on collapse and in late on expand, so text never wraps mid-motion.
- **Honor `prefers-reduced-motion`** by replacing the width spring with an instant change or a crossfade ([W3C 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).
- **Store the user's own toggle separately** from breakpoint-driven auto-collapse.

These are synthesis, not quoted spec. The research found **no authoritative source for a 200–300 ms "best practice"** collapse duration; Carbon's 110 ms is the only hard figure.

## Accessibility separates navigation links from tabs, and seven laws justify the layout

The most common implementation error is semantic. In the WAI-ARIA Authoring Practices Guide, a **sidebar is a named `<nav>` landmark of plain links**, with **`aria-current="page"` on the current one**, operated with Tab and Shift+Tab. It explicitly "does not use the WAI-ARIA menu role." Collapsible groups are **buttons with `aria-expanded` and `aria-controls`**, and Escape closes a group and returns focus to its button ([APG disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)). Primer follows the same model. It adds `aria-current="location"` for a section within a page and renders parent items as `<button>` toggles, not links ([Primer NavList](https://primer.style/product/components/nav-list/)).

The **tabs pattern** (`tablist` / `tab` / `tabpanel`, with `aria-selected` and `aria-orientation="vertical"` for vertical lists) is only for **switching panels in place**. Tab enters the list at the active tab, arrow keys move between tabs and wrap around, and the next Tab leaves the list. Automatic activation on focus is acceptable only when panels appear "without noticeable latency" ([APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)).

Native components complicate this. Compose exposes bar items as `Role.Tab` and hides the icon from screen readers when a label is visible ([NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt)). But a web bottom bar that changes pages is still navigation, so it should use links with `aria-current`, not `role="tab"`.

For a collapsed rail, **each icon link still needs a real accessible name**, preferably visually hidden text rather than a tooltip. Tooltips must appear on focus as well as hover, and must be dismissible, hoverable and persistent ([W3C 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)). The focus ring must not be hidden by an overlay panel ([W3C 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)). Target sizes form a ladder:

- **WCAG 2.5.8 (AA)**: 24×24 CSS px minimum. **WCAG 2.5.5 (AAA)**: 44×44 px ([W3C 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)).
- **Apple**: **44×44 pt default / 28×28 pt minimum** on iOS ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)).
- **Material**: the expanded rail's items fall back to the 48dp minimum interactive size ([WideNavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt)).

At accessibility text sizes, Apple's tab bar labels don't grow in place. Instead, a long press shows an enlarged **Large Content Viewer** ([WWDC19-261](https://developer.apple.com/wwdc19/261)).

**The Laws of UX map onto specific decisions:**

- **Hick's Law**: time to decide grows with the number of choices ([lawsofux.com](https://lawsofux.com/hicks-law/)). This supports the 3–5 item bar and NN/g's advice to show mobile navigation visibly only when there are **4 or fewer** top-level links ([NN/g Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/)).
- **Fitts's Law**: reach time depends on target size and distance ([lawsofux.com](https://lawsofux.com/fittss-law/)). Make the whole row the hit area. Edge-docked rails and bottom tab bars exploit screen edges. Collapsing shrinks the targets, which is the cost.
- **Jakob's Law**: users expect your app to work like the others they use ([lawsofux.com](https://lawsofux.com/jakobs-law/)). Keep navigation on the left and tabs at the bottom. NN/g reports that users look at the left half of the screen **80% of the time** and warns of "right-rail blindness" ([NN/g vertical nav](https://www.nngroup.com/articles/vertical-nav/)).
- **Chunking and common region**: group items under headers and dividers ([lawsofux.com](https://lawsofux.com/chunking/)). This is what lets a sidebar hold far more than seven items.
- **Serial position effect**: people remember first and last items best ([lawsofux.com](https://lawsofux.com/serial-position-effect/)). Put frequent items at the top and pin Settings to the footer, as Fluent does.
- **Von Restorff**: the item that differs is the one remembered ([lawsofux.com](https://lawsofux.com/von-restorff-effect/)). Exactly one row should look selected, so badges must be used sparingly or they compete with it.
- **Doherty Threshold**: responses under 400 ms keep people productive ([lawsofux.com](https://lawsofux.com/doherty-threshold/)). This caps collapse and tab-switch timing.
- **Tesler's Law**: complexity can be moved but not removed ([lawsofux.com](https://lawsofux.com/teslers-law/)). It names the hidden cost of collapsing: the meaning of the labels moves into the user's head unless tooltips, breakpoints and remembered state absorb it.

NN/g's data puts a number on that cost. On desktop, hidden navigation was used **27%** of the time against **48%** for visible navigation, discoverability dropped by more than 20%, and tasks were **at least 39% slower** ([NN/g Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/)). Labels "enlarge click targets," and icon-only navigation is not recommended for occasional visitors ([NN/g vertical nav](https://www.nngroup.com/articles/vertical-nav/)). Only a few icons, such as home, print and search, are near-universal ([NN/g Icon Usability](https://www.nngroup.com/articles/icon-usability/)).

## Conclusion

The systems agree on far more than their visual languages suggest. The shared definition is: one container that is either a short horizontal row or a tall vertical column; items made of an icon plus a label, plus an optional trailing slot; a state ladder that ends in a two-cue selected state; and a semantic split between navigation links and in-place tabs. They diverge on **who owns the measurements**. Material exposes everything as tokens. Apple now hides the numbers inside Liquid Glass components and specifies behavior (minimize on scroll, search replaces the bar, never disable). Carbon and Fluent sit in between with web-ready pixel values. For a class assignment, that means numbers can be borrowed from Material and Carbon, while Apple's contribution is a set of interaction rules worth treating as design constraints.

The less obvious takeaway concerns the collapsed state. Every source treats it as a **cost to be justified**, not as the elegant default. Apple says not to hide the sidebar by default. NN/g measures hidden navigation as 39% slower. Tesler's Law explains why. Material puts more of its design effort into the transition than into the collapsed state itself: expansion re-lays out items, changes type size and shifts density in a single spring. So the most rewarding place to spend design energy is the **morph between the two states**, plus the rules that decide when collapse happens: by breakpoint, by user toggle, and remembered across sessions.

Open gaps remain. These were not verified from primary sources:

- iOS 26 floating tab bar height, radius and inset
- Fluent's 320/48 px pane defaults
- Carbon v11 rail values
- Material's own wording on 3–5 items and on filled vs outlined icons
