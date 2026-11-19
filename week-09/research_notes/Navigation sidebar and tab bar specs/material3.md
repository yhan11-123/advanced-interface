# Material Design 3 navigation components: Navigation bar, Navigation rail (collapsed / expanded), Navigation drawer

Method note: m3.material.io pages are JavaScript-rendered and returned no readable content to the fetch tool (only the page title). All numbers below therefore come from Google's own implementation sources, which encode the M3 design tokens directly: the Jetpack Compose Material3 token files (androidx `androidx-main` branch, token version v0_11_0) and component sources, plus the Material Components for Android (MDC) docs on GitHub. These are primary sources (generated from the Material token pipeline), but a few wordings on m3.material.io itself could not be checked directly.

Token base URL (abbreviated below as `TOK/`): https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/
Component base URL (abbreviated as `CMP/`): https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/

## Navigation bar: heights, item layouts, indicator, type, badges, colors, states, motion

### Takeaway
Baseline M3 bar is 80dp tall with vertical items (icon over label, 56x32dp pill indicator); the M3 Expressive "short" (flexible) bar is 64dp tall and on medium windows (>=600dp) switches to horizontal items (icon beside label, 40dp-tall pill hugging icon+label). 3-5 destinations, 24dp icons, Label medium text, Error-colored badges (6dp dot / 16dp numbered).

### Cited Findings
**Container**
- `NavigationBarTokens`: ContainerHeight = 64dp (Expressive/short bar); TallContainerHeight = 80dp (baseline bar); ContainerColor = SurfaceContainer; ContainerElevation = Level2; NavShape = CornerNone; ItemBetweenSpace = 0dp — [NavigationBarTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt)
- The classic Compose `NavigationBar` uses `NavigationBarHeight = TallContainerHeight` (80dp) and 8dp horizontal padding between items (`NavigationBarItemHorizontalPadding = 8.dp`) — [NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt)
- MDC Android baseline: height 80dp, elevation 3dp, top item padding 12dp, bottom 16dp; M3 Expressive changes: height 80 -> 64dp, top padding 12 -> 6dp, bottom padding 16 -> 6dp, selected label no longer bold, active label color changes from on-surface-variant to secondary — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)
- Design name changed from "Bottom navigation" to "Navigation bar"; Android class remains `BottomNavigationView` — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)
- Destinations: 3 to 5; `BottomNavigationView` does not support more than 5 items — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)

**Vertical item (icon over label) — compact windows**
- `NavigationBarVerticalItemTokens`: ActiveIndicatorWidth = 56dp, ActiveIndicatorHeight = 32dp, IconSize = 24dp, ContainerBetweenSpace = 6dp (top/bottom item padding in the short bar) — [TOK/NavigationBarVerticalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarVerticalItemTokens.kt)
- Indicator padding around the icon is derived: horizontal (56-24)/2 = 16dp, vertical (32-24)/2 = 4dp; indicator-to-label gap = 4dp (`ItemActiveIndicatorIconLabelSpace` / `TopIconIndicatorToLabelPadding`) — [CMP/ShortNavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ShortNavigationBar.kt); [TOK/NavigationBarTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt)
- Indicator shape = CornerFull (pill) — [TOK/NavigationBarTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt)
- MDC: indicator 56dp x 32dp, "50% rounded", 4dp horizontal margin, 4dp indicator-to-label padding — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)

**Horizontal item (icon beside label) — medium windows, Expressive only**
- `NavigationBarHorizontalItemTokens`: ActiveIndicatorHeight = 40dp, ActiveIndicatorLeadingSpace = 16dp, ActiveIndicatorTrailingSpace = 16dp, IconSize = 24dp; icon-to-label space = 4dp — [TOK/NavigationBarHorizontalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarHorizontalItemTokens.kt); [CMP/ShortNavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ShortNavigationBar.kt)
- MDC Expressive: at window width >= 600dp icon moves from top to start, item width becomes content-based with a max width (not fixed by item count), item gravity changes from top-center to center — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)
- Compose `ShortNavigationBar` with Centered arrangement computes side padding as `((100 - 10*(itemCount+3)) / 2) %` of bar width (no padding when >6 items) — e.g. 4 items -> 15% each side — [CMP/ShortNavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ShortNavigationBar.kt)
- Conflict: MDC docs list the horizontal ("expanded") indicator as 56dp tall with 20dp horizontal margin; Compose bar tokens say 40dp tall. The 56dp/20dp values match the rail's horizontal item (see rail section) — MDC text appears shared between bar and rail docs — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md) vs [TOK/NavigationBarHorizontalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarHorizontalItemTokens.kt)

**Typography**
- Label font = `LabelMedium` (Compose token) — [TOK/NavigationBarTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt)
- Conflict: MDC Android uses `textAppearanceTitleSmall` for active and inactive labels, active bold by default (baseline), max 1 line — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)

**Colors**
- Active indicator = SecondaryContainer; active icon = OnSecondaryContainer; active label = Secondary (Expressive); inactive icon and label = OnSurfaceVariant — [TOK/NavigationBarTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt)
- MDC baseline active label = colorOnSurface; container `colorSurfaceContainer` — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)

**Badges**
- `BadgeTokens`: small badge Size = 6dp, CornerFull; large badge LargeSize = 16dp (height), CornerFull; color = Error; large label text = OnError, font LabelSmall — [TOK/BadgeTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/BadgeTokens.kt)
- MDC: badge is icon-only (dot) by default; set number or text (e.g. 99 or "New") for the large form — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)

**Label visibility (MDC)**
- AUTO (default: all labeled if <=3 items, selected-only if >=4), SELECTED, LABELED, UNLABELED — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)

**State layers**
- `StateTokens`: Hover 0.08, Focus 0.10, Pressed 0.10, Dragged 0.16 — [TOK/StateTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt)
- Only the indicator pill shows the ripple/state layer, even though the whole item is clickable (source comment: "The entire item is selectable, but only the indicator pill shows the ripple") — [CMP/NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt)
- MDC ripple: inactive = variations of colorPrimary / colorOnSurfaceVariant; active = variations of colorPrimary — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)

**Motion on selection**
- `NavigationBarItem`: icon and label color change animate with `MotionSchemeKeyTokens.DefaultEffects`; indicator alpha animates with DefaultEffects; indicator size (the pill growing out from the icon center) animates with `FastSpatial`. In the classic bar, when labels show only on selection, the icon shifts up to make room for the label, interpolated by the same progress value — [CMP/NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt)

### Inferences
- The "64x32" pill in the brief is likely a misreading of MDC's line "Active indicator: 64dp to 56dp"; current tokens give 56x32 for vertical items in both baseline and Expressive.
- The indicator does not slide between items; each item's own pill fades in (effects spring) and scales out (fast spatial spring), so selection reads as "bloom in place".

### Gaps
- Exact m3.material.io wording for item-count guidance and icon filled/outlined switching could not be fetched (JS-rendered site).
- Expressive bar elevation: token says Level2, MDC says 3dp (Level2 is 3dp in the standard M3 elevation scale, but the scale file was not re-fetched).

## Navigation rail: collapsed / expanded (WideNavigationRail), widths, items, header slot, modal vs standard, motion

### Takeaway
M3 Expressive rail is 96dp wide collapsed (baseline rail 80dp) and expands to 220-360dp; collapsed items are vertical (56x32 pill, Label medium), expanded items are horizontal (56dp-tall pill, Label large). Expansion is a width spring (DefaultSpatial standard; FastSpatial modal). The expanded rail replaces the navigation drawer.

### Cited Findings
**Widths and spacing**
- `NavigationRailCollapsedTokens`: ContainerWidth = 96dp; NarrowContainerWidth = 80dp; ItemVerticalSpace = 4dp; TopSpace = 44dp; ContainerColor = Surface; elevation Level0; shape CornerNone — [TOK/NavigationRailCollapsedTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailCollapsedTokens.kt)
- `NavigationRailExpandedTokens`: ContainerWidthMinimum = 220dp; ContainerWidthMaximum = 360dp; TopSpace = 44dp; standard elevation Level0, shape CornerNone; Modal: elevation Level2, shape CornerLarge, color SurfaceContainer — [TOK/NavigationRailExpandedTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailExpandedTokens.kt)
- MDC table baseline -> Expressive: width 80 -> 96dp; item min height 60 -> 64dp; item spacing 0 -> 4dp; elevation 0 -> 3dp; top item padding 4 -> 6dp; bottom item padding 12 -> 4dp; top margin of content 8 -> 44dp; header-to-items padding 8 -> 40dp — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)
- Baseline Compose `NavigationRail`: 4dp vertical padding, 8dp header padding — [CMP/NavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationRail.kt)

**Items**
- `NavigationRailBaselineItemTokens`: ContainerHeight = 64dp (item min height); IconSize = 24dp; ActiveIndicatorShape = CornerFull; ActiveIndicatorLeadingSpace/TrailingSpace = 16dp; ActiveIndicatorIconLabelSpace = 8dp; ContainerVerticalSpace = 6dp; HeaderSpaceMinimum = 40dp — [TOK/NavigationRailBaselineItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailBaselineItemTokens.kt)
- Vertical (collapsed) item: indicator 56 x 32dp, icon-label space 4dp, label font LabelMedium — [TOK/NavigationRailVerticalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailVerticalItemTokens.kt)
- Horizontal (expanded) item: indicator height 56dp, leading space 16dp, icon-label space 8dp, full-width leading/trailing 16dp, label font LabelLarge — [TOK/NavigationRailHorizontalItemTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailHorizontalItemTokens.kt)
- Wide rail item horizontal padding = 20dp (`WNRItemHorizontalPadding`) — [CMP/WideNavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt)
- MDC: expanded indicator width HUG, height 56dp, 20dp horizontal margin, 16dp padding; collapsed 56x32dp with 4dp margin and 4dp gap to label — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)

**Colors**
- `NavigationRailColorTokens`: active indicator SecondaryContainer; active icon OnSecondaryContainer; active label Secondary; inactive icon/label OnSurfaceVariant; all hover/focus/pressed state layers (active and inactive) = OnSecondaryContainer — [TOK/NavigationRailColorTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailColorTokens.kt)
- MDC: Expressive active label no longer bold; vertical active label color on-surface-variant -> secondary; ripple colorPrimary at 12% (baseline MDC) — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)

**Header (menu / FAB) slot, sections, counts**
- Header view (e.g. menu button, FAB, Extended FAB, logo) anchored at top via `app:headerLayout`; FAB optional — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)
- Collapsed shows top-level items only (up to 7); expanded shows all items including submenus; submenus (section headers) visible only when expanded; optional dividers between submenus; recommended 3-7 destinations — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)
- Label visibility modes same as bar (AUTO/SELECTED/LABELED/UNLABELED) — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)

**Modal vs standard**
- Expanded rail types: standard (non-modal, pushes content, transitions to collapsed rail) and modal (`ModalWideNavigationRail`, floats over content with scrim; SurfaceContainer, Level2, CornerLarge) — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md); [TOK/NavigationRailExpandedTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailExpandedTokens.kt)
- Predictive back on modal rail: max scale distance 24dp (X) / 48dp (Y), pivot at 50% height — [CMP/WideNavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt)

**Expansion motion**
- `WideNavigationRail` animates its width collapsed (96) -> expanded min (220) / max (360) with `DefaultSpatial` spring when standard, `FastSpatial` when modal; item vertical spacing animates 4dp -> 0dp and item min height 64dp -> 48dp-a11y-minimum, both with DefaultSpatial; label/content fades use `DefaultEffects`; modal open/close state uses DefaultSpatial — [CMP/WideNavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt)
- MDC: `expand()` / `collapse()` use a ChangeBounds transition; advise disabling other animations during expansion — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)
- Collapsed rail item selection motion = same as bar (colors DefaultEffects, indicator size FastSpatial) — [CMP/NavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationRail.kt)

### Inferences
- In expansion, items morph from vertical (icon over label, 32dp pill) to horizontal (icon beside label, 56dp pill) while the container width springs; the item min height collapsing from 64 to 48dp is what makes the expanded list denser.
- Because standard uses DefaultSpatial (slower, softer) and modal uses FastSpatial, a modal rail feels snappier than a docked one.

### Gaps
- Precise expanded-rail section header type token (likely Title small, as in drawer) not found in rail token files (they contain TODOs for missing tokens).
- MDC demo image alt text says 72dp collapsed width while text/code say 80dp — noted inconsistency in [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md).

## Navigation drawer (standard & modal) and its deprecation

### Takeaway
Drawer is 360dp wide with 56dp pill items (336dp indicator = full width minus 12dp side padding), Label large text, Title small headers; but in M3 Expressive (May 2025) it is deprecated in favor of the expanded navigation rail.

### Cited Findings
- `NavigationDrawerTokens`: ContainerWidth = 360dp; ActiveIndicatorWidth = 336dp; ActiveIndicatorHeight = 56dp; ActiveIndicatorShape = CornerFull; IconSize = 24dp; LabelTextFont = LabelLarge; HeadlineFont (section header) = TitleSmall, color OnSurfaceVariant; LargeBadgeLabelFont = LabelLarge, color OnSurfaceVariant (the trailing "24"-style count) — [TOK/NavigationDrawerTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt)
- Container: Standard = Surface, Level0; Modal = SurfaceContainerLow, Level1; ContainerShape = CornerLargeEnd; BottomContainerShape = CornerLargeTop; height 100% — [TOK/NavigationDrawerTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt)
- Colors by state: active indicator SecondaryContainer; active icon/label OnSecondaryContainer in all states (enabled, hover, focus, pressed); inactive icon/label OnSurfaceVariant at rest, OnSurface on hover/focus/pressed; focus indicator Secondary — [TOK/NavigationDrawerTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt)
- Padding: `NavigationDrawerItemDefaults.ItemPadding` = 12dp horizontal (outer); inside item: start 16dp, end 24dp; 12dp spacer between icon, label and badge; minimum drawer width 240dp — [CMP/NavigationDrawer.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationDrawer.kt)
- Motion: drawer open = `DefaultSpatial` spring; close = `FastEffects`; drag snap = DefaultSpatial; positional threshold 50%, velocity threshold 400dp/s; predictive back scale 12dp grow / 24dp shrink — [CMP/NavigationDrawer.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationDrawer.kt)
- Deprecation: 9to5Google reports the navigation drawer "is being deprecated in the Material 3 expressive update", replaced by the collapsed/expanded rail — [9to5Google, May 2025](https://9to5google.com/2025/05/14/material-3-expressive-navigation/)
- MDC: "The expanded rail is intended to replace the navigation drawer"; original rail renamed "collapsed navigation rail"; no formal removal date — [MDC NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)
- SAP Fiori (Android, M3-based): "The navigation drawer is being deprecated with Material 3 Expressive... we recommend using the expanded navigation rail instead", though its v26.4 still allows a standard drawer on very wide windows — [SAP Fiori v26.4 drawer](https://www.sap.com/design-system/fiori-design-android/v26-4/components/m3-standard-components/navigation-drawer/usage)
- Compose still ships `ModalNavigationDrawer`, `DismissibleNavigationDrawer`, `PermanentNavigationDrawer` (not annotated deprecated as components; only some DrawerState methods are) — [CMP/NavigationDrawer.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationDrawer.kt)

### Inferences
- 336 = 360 - 2x12, so the "full-width pill" is the item with 12dp outer inset on each side; radius 28dp follows from CornerFull on a 56dp height.
- Treat the drawer as "baseline M3, deprecated in Expressive design guidance but still available in code".

### Gaps
- Divider spec (inset, color OutlineVariant?) and section-header padding (28dp?) not present in token files; not verified.
- CornerLarge = 16dp, Level1 = 1dp per standard M3 scales, not re-fetched here.

## States: enabled, hover, focused, pressed, selected

### Takeaway
State is shown with a state layer over the indicator (hover 8%, focus 10%, pressed 10%) plus color role shifts; selection changes indicator (SecondaryContainer appears), icon/label color, and in baseline MDC the label weight (bold), which Expressive removes.

### Cited Findings
- Opacities: hover 0.08, focus 0.10, pressed 0.10, dragged 0.16 — [TOK/StateTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt)
- Rail/bar state-layer color OnSecondaryContainer for both active and inactive items — [TOK/NavigationRailColorTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailColorTokens.kt)
- Drawer inactive items darken to OnSurface on hover/focus/press — [TOK/NavigationDrawerTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt)
- Baseline MDC: active label bold by default; Expressive: no longer bold, active label color -> Secondary — [MDC BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md)
- Focus ring color on drawer = Secondary — [TOK/NavigationDrawerTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt)

### Inferences
- Disabled state is not specified in these token files (navigation items are rarely disabled).

### Gaps
- Filled (selected) vs outlined (unselected) icon convention is a Material guideline commonly cited, but I could not fetch the m3.material.io guidelines page to confirm current wording; Compose leaves icon swapping to the developer (`icon`/`selectedIcon` passed by app).

## Motion: M3 Expressive spring tokens

### Takeaway
M3 motion uses springs defined by damping ratio and stiffness in two families: spatial (position/size, may bounce) and effects (color/opacity, never bounce), each fast/default/slow. Expressive scheme lowers spatial damping for visible bounce.

### Cited Findings
- Expressive scheme: Fast spatial 0.6 / 800; Default spatial 0.8 / 380; Slow spatial 0.8 / 200; Fast effects 1.0 / 3800; Default effects 1.0 / 1600; Slow effects 1.0 / 800 (damping / stiffness) — [TOK/ExpressiveMotionTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)
- Standard scheme: Fast spatial 0.9 / 1400; Default spatial 0.9 / 700; Slow spatial 0.9 / 300; effects identical to expressive (1.0 / 3800, 1600, 800) — [TOK/StandardMotionTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt)
- Usage: bar/rail indicator size = FastSpatial; colors and indicator alpha = DefaultEffects; wide rail width = DefaultSpatial (standard) / FastSpatial (modal); drawer open DefaultSpatial, close FastEffects — [CMP/NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt); [CMP/WideNavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt); [CMP/NavigationDrawer.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationDrawer.kt)

### Inferences
- With Expressive fast spatial (damping 0.6) the indicator pill visibly overshoots when it grows in; under the standard scheme (0.9) it barely overshoots. For CSS, these can be approximated with `linear()` springs.
- Closing a drawer with an effects spring (no bounce) while opening with a spatial spring is a deliberate asymmetry: entry has personality, exit gets out of the way.

### Gaps
- No duration/easing (ms + cubic-bezier) values exist for these components in current Compose sources; the older M3 easing/duration tokens (e.g. emphasized easing) were not mapped to navigation here.

## Accessibility and adaptive placement

### Takeaway
Items are exposed as selectable tabs with a 48dp minimum touch target; bar for compact windows, rail for medium+, horizontal bar items allowed on medium.

### Cited Findings
- Compose bar items use `Modifier.selectable(role = Role.Tab)`; icon semantics are cleared when a label is visible so screen readers don't repeat it — [CMP/NavigationBar.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt)
- Wide rail item min height falls back to `LocalMinimumInteractiveComponentSize` (the minimum touch target) when expanded — [CMP/WideNavigationRail.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/WideNavigationRail.kt)
- Android guidance: nav bar holds 3-5 destinations and "translates to the navigation rail for large screens"; don't use a bottom bar on large screens; "Medium sizes can use the nav rail or horizontal navigation items" — [Android Developers: Layouts and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns)
- Rail guidance covers medium, expanded, large and extra-large windows — [9to5Google](https://9to5google.com/2025/05/14/material-3-expressive-navigation/)

### Inferences
- For web, the equivalent is a `<nav>` landmark with links and `aria-current="page"` (navigation) or `role="tablist"` (in-page view switching, matching Compose's Role.Tab); arrow-key roving focus applies to the tablist pattern.

### Gaps
- `LocalMinimumInteractiveComponentSize` default (48dp) is standard Compose knowledge, not re-fetched; m3.material.io accessibility pages (keyboard behavior specifics) could not be read.
