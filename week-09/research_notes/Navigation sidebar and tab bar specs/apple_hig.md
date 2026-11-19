# Apple HIG: Sidebars and Tab Bars (iOS / iPadOS / macOS 26, Liquid Glass era)

Method note: the HIG pages are rendered with JavaScript, so the text was read from Apple's own JSON data endpoints (same content as the web pages): `developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`. Older (pre-26) values come from Internet Archive copies of the same JSON files (2024 snapshot). The current Sidebars and Tab bars pages both carry a change-log entry dated **June 8, 2026**, so they are current for the 26 cycle.

Labels used below:
- **[Official, current]** = on the live HIG page as of Nov 2026
- **[Official, pre-26, removed]** = was in the HIG in 2024 but is no longer on the current page
- **[Third-party / measured]** = not stated by Apple

## 1. Sidebars: purpose, when to use, structure, hide/show, sizes

### Takeaway
Apple now describes a sidebar as a floating Liquid Glass panel on the leading edge for top-level areas or collections. Keep it to at most two levels of hierarchy. Use SF Symbols with accent-colored icons, and let people hide it. Apple recommends **trying a tab bar first** on iPhone and iPad, and the "sidebar-adaptable" tab view gives you both. The exact macOS row and icon sizes table (24/28/32 pt rows) was **removed** from the current HIG and survives only in older versions.

### Cited Findings
**Definition and when to use**
- [Official, current] Definition: "A sidebar appears on the leading side of a view and lets people navigate between areas of your app or top-level collections of content, like folders and playlists." — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] A sidebar needs a lot of vertical and horizontal space. When space is limited, a more compact control such as a tab bar may work better. For many apps you don't need to choose, because you can adopt a style of tab bar that provides both. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] iOS/iPadOS: "Consider using a tab bar first." A tab bar leaves more room for content. If you need more areas than fit, the tab bar's convertible sidebar-style appearance can give access to less-used content. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] Layout: keep functionality the same as size classes change, but use larger spaces to switch from a tab bar to a sidebar. — [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Official, current] Split views: a split view commonly shows a sidebar in the leading pane (top-level items or collections), with secondary and tertiary panes for child collections and details. — [HIG Split views](https://developer.apple.com/design/human-interface-guidelines/split-views)

**Liquid Glass look**
- [Official, current] In iOS, iPadOS and macOS, sidebars "can float above content in the Liquid Glass layer." Extend content beneath the sidebar by letting it scroll horizontally, or by applying a **background extension effect** that mirrors adjacent content so it looks stretched under the sidebar (`backgroundExtensionEffect()`). — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] Liquid Glass forms "a distinct functional layer for controls and navigation elements — like tab bars and sidebars — that floats above the content layer." Sidebars use the **regular** variant, which blurs and adjusts the luminosity of what's behind them; Apple names "alerts, sidebars, or popovers" as text-heavy uses for it. — [HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Official, WWDC25] "Sidebars are now inset and built with Liquid Glass, allowing content to flow behind them." Scroll views now extend beneath the sidebar by default. — [WWDC25 "Get to know the new design system" (356)](https://developer.apple.com/videos/play/wwdc2025/356/)
- [Official, WWDC25] NavigationSplitView "now [has] a Liquid Glass sidebar that floats above your content." `backgroundExtensionEffect()` mirrors and blurs an image outside the safe area. — [WWDC25 "Build a SwiftUI app with the new design" (323)](https://developer.apple.com/videos/play/wwdc2025/323/)
- [Official, current] For full-screen background content, extend it under sidebars, toolbars and tab bars. Use a scroll edge effect rather than a solid or semi-opaque background behind controls. — [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

**Rows, icons, hierarchy**
- [Official, current] Use familiar symbols (SF Symbols). For a custom icon, make a custom symbol rather than a bitmap. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current, updated June 2026] Sidebar icons use the app accent color by default. On macOS, people can change the system accent color and expect every sidebar icon to follow it. Fixed colors, used sparingly, can clarify meaning or draw attention; for example, Mail's VIP icon is yellow. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] Show no more than two levels of hierarchy. For deeper hierarchies, use a split view with a content list between the sidebar and the detail view. Group hierarchy with **disclosure controls**, and give each group a short, descriptive label. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] Let people customize the sidebar's contents and order when possible. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] Search: put search at the top of the sidebar when filtering it (as in Settings), or add Search as a sidebar item when you want an area dedicated to discovery (as in Music and TV). — [HIG Search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields)
- [Official, pre-26, removed] To add a new group, put an Add (+) button on the trailing side of the group label, next to the disclosure triangle. Put other actions, such as remove, in a context menu or a menu-bar menu. — [HIG Sidebars, 2024 archive](https://web.archive.org/web/2024/https://developer.apple.com/design/human-interface-guidelines/sidebars)

**Hide and show**
- [Official, current] Consider letting people hide the sidebar, using the interactions they already know for the platform:
  - iPadOS: the built-in **edge swipe**.
  - macOS: a show/hide button, or Show Sidebar / Hide Sidebar commands in the View menu.
  - visionOS: the window usually expands to fit the sidebar, so people rarely need to hide it.

  "Avoid hiding the sidebar by default." — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] macOS: consider collapsing and revealing the sidebar automatically as the window resizes; Mail collapses its sidebar when the window shrinks. Don't put critical information or actions at the bottom of a sidebar, because windows are often moved so the bottom edge is hidden. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, current] iPadOS `sidebarAdaptable`: you choose whether the app opens with a sidebar or a tab bar. Both variations include a button to switch between them, and the control responds automatically to rotation and window resizing. To show a sidebar only, use `NavigationSplitView` or `UISplitViewController`. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, pre-26 wording] Starting in the 18 releases, `sidebarAdaptable` maps by platform:
  - iOS: a bottom tab bar
  - iPadOS: a tab bar that people can convert to a sidebar
  - macOS 15 and tvOS: a sidebar
  - visionOS: an ornament, plus a sidebar for secondary tabs

  — [HIG Sidebars, 2024 archive](https://web.archive.org/web/2024/https://developer.apple.com/design/human-interface-guidelines/sidebars)

**Sizes**
- [Official, current] macOS: a sidebar's row height, text and glyph size depend on its overall size (small, medium or large). People can change it with the sidebar icon size option in General settings. **The current page gives no numbers.** — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, pre-26, removed] Table of default metrics for macOS sidebars (2024 HIG):

  | Size | Row height | Icon (@1x) | Text | SF Symbol scale |
  |---|---|---|---|---|
  | Small | 24 pt | 16×16 px | 11 pt (Subhead) | Medium |
  | Medium | 28 pt | 20×20 px | 13 pt (Body) | Medium |
  | Large | 32 pt | 24×24 px | 15 pt (Title 3) | Medium |

  All sizes: horizontal spacing between cells 17 pt, vertical spacing 0 pt. Bitmap icons were to be supplied at @1x and @2x in all three sizes. — [HIG Sidebars, 2024 archive](https://web.archive.org/web/2024/https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Official, pre-26, removed] macOS (non-SwiftUI): use an opaque background when a window has more than one sidebar, or in panels and settings windows. Otherwise use a translucent sidebar background. Liquid Glass has since replaced this. — [HIG Sidebars, 2024 archive](https://web.archive.org/web/2024/https://developer.apple.com/design/human-interface-guidelines/sidebars)

### Inferences
- Apple has moved from "specs you build to" toward "use the system component". Removing the metrics table in the Liquid Glass era suggests sizes are now meant to come from the framework and the user's settings, not from designers. For a class prototype, the 24/28/32 pt rows and 16/20/24 icons are still the best documented official reference, but cite them as pre-26.
- The edge-swipe, toggle-button and auto-collapse guidance means a sidebar has three hide triggers: a gesture, an explicit control, and window size.

### Gaps
- No current official values for sidebar width ranges (min, ideal, max), iPad sidebar row height, or the floating sidebar's inset and corner radius. `NavigationSplitView` column-width APIs exist, but Apple publishes no HIG width numbers. A design kit (Apple Design Resources, iOS/iPadOS 26 Figma kit) would have to be measured; I could not open the kits here.
- The HIG gives no specific guidance on **counts or badges in sidebar rows**. The tab bar badge rules (red oval, critical information only) are the nearest official text. Trailing counts, as in Mail, are a common system pattern but aren't codified on the Sidebars page.
- Selected-row treatment, such as an accent-tinted rounded highlight or a Liquid Glass selection capsule, is not described in words on the current page; it appears only in images.

## 2. Tab bars: anatomy, iOS 26 floating bar, search tab, count, badges, minimize, iPad

### Takeaway
On iOS 26 the tab bar floats above content at the bottom on a Liquid Glass background. Search can be a dedicated tab at the trailing end, styled either as a standard tab or as a separate button. An optional accessory (such as Music's MiniPlayer) can be used with **minimize on scroll**, where the bar shrinks and the accessory moves inline. On iPad the tab bar sits near the top and can convert to a sidebar. Apple no longer gives a fixed tab count; the only number is "five or fewer" for customizable iPad defaults. Pixel dimensions were also removed from the current page.

### Cited Findings
**Purpose and rules**
- [Official, current] "A tab bar lets people navigate between top-level sections of your app," and it preserves each section's navigation state. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] Use the tab bar for navigation, not actions; use a toolbar for actions. Keep it visible across sections; the exception is a modal covering it. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] Tab count: use "the appropriate number of tabs," because fewer tabs are easier to navigate. Avoid overflow: when space runs out, the trailing tab becomes a **More** tab in iOS and iPadOS. For complex apps, consider a sidebar or an adaptable tab bar. On iPadOS, if people can customize tabs, "aim for a default list of five or fewer to preserve continuity between compact and regular view sizes." — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] "Don't disable or hide tab bar buttons, even when their content is unavailable." Explain why an empty section is empty. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)

**Icon and label layout**
- [Official, current] Include tab labels, using single words when possible. Use SF Symbols, and "prefer filled symbols." In compact views icons sit **above** labels; in regular views icons and labels sit **side by side**. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] An iOS tab bar prefers the fill variant of a symbol, and a toolbar takes outline. You don't need separate selected and unselected icon artwork for system tab bars, because the system updates the selected appearance automatically. — [HIG SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols); [HIG Icons](https://developer.apple.com/design/human-interface-guidelines/icons)

**Badges and color**
- [Official, current] A badge is "a red oval containing white text and either a number or an exclamation point." Reserve badges for critical information. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] Avoid giving tab labels a color similar to the content behind them. Over colorful content, prefer a monochromatic tab bar or a clearly different accent color. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, WWDC25] Tab bars, segmented controls and sidebars "all signal selection, navigation, and state in consistent ways." Remove custom bar backgrounds and borders. — [WWDC25-356](https://developer.apple.com/videos/play/wwdc2025/356/)

**iOS 26 floating bar, accessory, minimize**
- [Official, current] iOS: "A tab bar floats above content at the bottom of the screen. Its items rest on a Liquid Glass background that allows content beneath to peek through." — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] Accessory and minimize: with an attached accessory, you can minimize the tab bar and move the accessory inline when the person scrolls down. Tapping a tab or scrolling to the top exits the minimized state. APIs: `TabBarMinimizeBehavior` (SwiftUI) and `UITabBarController.MinimizeBehavior` (UIKit). — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, WWDC25] Minimize on scroll uses `.tabBarMinimizeBehavior(.onScrollDown)`, and the bar "re-expands when scrolling in the opposite direction." The accessory uses `tabViewBottomAccessory`; read `tabViewBottomAccessoryPlacement` (`.inline` vs expanded) to switch between compact and full layouts. — [WWDC25-323](https://developer.apple.com/videos/play/wwdc2025/323/)
- [Official, WWDC25] Accessories are for persistent features such as playback. Don't put screen-specific actions there; a checkout button belongs with its content. — [WWDC25-356](https://developer.apple.com/videos/play/wwdc2025/356/)

**Search tab**
- [Official, current] A tab bar can include a dedicated search tab at the trailing end. There are two styles:
  - **Standard tab**: matches the other tabs and opens a search landing page; good for discovery, as in Apple TV.
  - **Button appearance**: appears as a separate button, focuses the field and raises the keyboard right away, then returns people to the previous tab; good for fast, transient search.

  — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars); [HIG Search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields)
- [Official, WWDC25] Built with `Tab(role: .search)` plus `.searchable`. When selected, "a search field takes the place of the tab bar." On iPad and Mac, the field appears centered above browsing suggestions. — [WWDC25-323](https://developer.apple.com/videos/play/wwdc2025/323/)

**iPadOS, visionOS, tvOS**
- [Official, current] iPadOS: the tab bar appears near the top of the screen, either fixed (`tabBarOnly`) or with a button that converts it to a sidebar (`sidebarAdaptable`). "Prefer a tab bar for navigation." Let people customize the tab bar; for example, Music lets them pin a playlist (`TabViewCustomization`, `UITab.Placement`). — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] visionOS: the tab bar is always vertical and fixed to the window's leading side. It expands when looked at, which reveals the labels; the symbols are always visible. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] tvOS (the only hard numbers on the current page): height **68 pt**, top edge **46 pt** from the top of the screen, neither changeable. The bar is translucent and only the selected tab is opaque. A focused selected tab gets a drop shadow. Overflowing tabs fade at the edges. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)

**Dimensions**
- [Official, current] The current page says only "see [Apple Design Resources] for tab bar icon dimensions"; no numbers are given. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars); [Apple Design Resources](https://developer.apple.com/design/resources/)
- [Official, pre-26, removed] Target dimensions for custom bitmap tab icons (2024 HIG):

  | Shape | Regular tab bar | Compact tab bar |
  |---|---|---|
  | Circle | 25×25 pt | 18×18 pt |
  | Square | 23×23 pt | 17×17 pt |
  | Wide | 31 pt wide | 23 pt wide |
  | Tall | 28 pt tall | 20 pt tall |

  Supply @2x and @3x versions. — [HIG Tab bars, 2024 archive](https://web.archive.org/web/2024/https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Third-party / measured] Classic tab bar height 49 pt (83 pt including the home-indicator area), repeated by a third-party iOS 26 design-system summary and an Apple Developer Forums post asking whether the iOS 26 UITabBar is too tall on Touch ID devices. Neither is Apple documentation. — [Apple Developer Forums thread 796986](https://developer.apple.com/forums/thread/796986); [skillsmp ios26 design summary](https://skillsmp.com/creators/seunghan91/ios26-design-system/skills-ios26-design)
- [Third-party / measured] FabBar, an open-source recreation, says its bar height, spacing and font sizes are "hardcoded to match iOS 26's tab bar." It uses **21 pt** padding from the screen edges for the floating bar, but doesn't list the other values. — [FabBar on GitHub](https://github.com/ryanashcraft/fabbar)

### Inferences
- The iOS 26 tab bar has a clear anatomy:
  1. A floating Liquid Glass capsule holding 2–5 tabs (filled SF Symbol above a one-word label)
  2. Optionally, a separate circular search button at the trailing end
  3. Optionally, an accessory capsule above the bar

  Minimize-on-scroll collapses 1 and 3 into one compact row and expands them again on reverse scroll, a tab tap, or scrolling to the top. That gives three motion states to design: expanded, minimized, and search-active (the field replaces the bar).
- "3–5 tabs" is a widespread rule of thumb. The current HIG doesn't state it for iPhone; its only number is the "five or fewer" default for customizable iPad tabs. Cite it that way.

### Gaps
- Apple publishes no official iOS 26 floating tab bar height, capsule corner radius, side inset, selected-tab "glass droplet" size, label point size (10 pt is the long-held kit value but was not verified in this session), or icon point size. These need measuring from the iOS 26 Apple Design Resources kit or screenshots.
- The minimize animation's timing or spring values are not documented anywhere.

## 3. States: default, pressed, selected, hover, disabled; pointer effects

### Takeaway
Apple gives states mostly through system behavior, not specs. Selected states are generated automatically. Tab bar items should **never** be disabled. On iPad, hover with a pointer uses a Liquid Glass "highlight" effect on tab bars.

### Cited Findings
- [Official, current] **Selected**: you don't need to supply separate selected icons for tab bars; the system handles it. — [HIG Icons](https://developer.apple.com/design/human-interface-guidelines/icons)
- [Official, current] **Disabled**: don't disable or hide tab bar buttons. Show an explanatory empty state instead. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] **Hover (iPad pointer)**: "The highlight effect materializes a Liquid Glass shape between the pointer and the control it's moving over... By default, iPadOS applies the highlight effect to bar buttons, tab bars, segmented controls, and edit menus." Lift is used on standalone Liquid Glass controls; hover is a custom scale/tint/shadow effect. — [HIG Pointing devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices)
- [Official, current] **Sidebar on a touch Mac or iPad**: tapping a section header or row reveals its hidden controls. For example, tapping Finder's Favorites header collapses the section and reveals the disclosure button. Keep those controls visible until touch moves outside the sidebar. — [HIG Pointing devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices)
- [Official, current] **tvOS focus**: the selected tab is opaque, and when focused it gains a drop shadow. — [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Official, current] Liquid Glass changes with system settings such as Reduce Transparency, Increase Contrast, and the user's preferred Liquid Glass look. — [HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials)

### Inferences
- In Apple's model, a tab item has default, pressed, selected and hover/focus states, and **no disabled state**. Sidebar rows have default, selected and hover states, plus a disclosure state (expanded or collapsed) on group headers.

### Gaps
- The HIG doesn't describe the pressed/highlighted visuals (for example, the iOS 26 glass "droplet" that grows under a finger) or the sidebar selected-row appearance in text.

## 4. Accessibility and keyboard

### Takeaway
The official baseline is a 44×44 pt default control size (28×28 pt minimum) on iOS/iPadOS and 28×28 / 20×20 pt on macOS. Tab bar labels at large Dynamic Type sizes use the **Large Content Viewer** (long-press shows an enlarged label) instead of growing in place. iPadOS supports keyboard navigation in sidebars.

### Cited Findings
- [Official, current] Control sizes (default / minimum): iOS and iPadOS **44×44 pt / 28×28 pt**; macOS **28×28 pt / 20×20 pt**; visionOS **60×60 pt / 28×28 pt**. — [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Official, current] Give custom interface icons alternative text (accessibility labels) for VoiceOver. — [HIG Icons](https://developer.apple.com/design/human-interface-guidelines/icons)
- [Official, Apple docs] `UILargeContentViewerInteraction` presents the large content viewer "for cases when supporting the largest dynamic type sizes isn't appropriate". It is not a replacement for proper Dynamic Type support. Items opt in with `showsLargeContentViewer`, and the interaction must be on the item or an ancestor. — [UILargeContentViewerInteraction](https://developer.apple.com/documentation/uikit/uilargecontentviewerinteraction)
- [Official, WWDC19] Session 261 introduced the Large Content Viewer, with the tab bar as the canonical example: when Dynamic Type is set to an accessibility size, long-pressing a tab shows an enlarged HUD of the icon and label. — [WWDC19 "Large Content Viewer" (261)](https://developer.apple.com/wwdc19/261)
- [Third-party] A forum report says the interaction isn't supported on a standalone `UITabBar` outside `UITabBarController`; this may be out of date. — [Apple Developer Forums 721352](https://developer.apple.com/forums/thread/721352)
- [Official, current] Keyboard: "iPadOS supports keyboard navigation in text fields, text views, and sidebars." Other controls rely on Full Keyboard Access. macOS: Control-F5 moves focus to the toolbar and Control-F6 to the next panel; Tab and Shift-Tab move between controls. — [HIG Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Official, current] Avoid hiding the sidebar by default, so it stays discoverable. Keep the tab bar visible so people always know where they are. — [HIG Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars); [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)

### Inferences
- System tab bars get the VoiceOver "tab" trait and the "n of m" position announcement automatically (standard UIKit behavior). A custom HTML or JS prototype would mimic this with `role="tablist"`/`role="tab"` and `aria-selected`, or with `nav` plus `aria-current="page"`, since a tab bar is navigation. I did not cite an Apple page for the trait wording.

### Gaps
- No HIG text on VoiceOver traits specific to tab bars or sidebars was found in this session. The current HIG states no tab label font size or Dynamic Type cap.
