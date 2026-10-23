// Week 05: fills a prototype's Spec section from the CSS it actually runs on.
// <td data-var="--row-h"></td>            prints the value of that custom property
// <td data-var="--glow" data-kind="color"> prints it with a swatch
// <td data-var="--sw-w,--sw-h" data-join=" × ">  joins several
// Values are read from the element named by data-from (a selector), else :root.
(function () {
  for (const cell of document.querySelectorAll('[data-var]')) {
    const from = cell.dataset.from ? document.querySelector(cell.dataset.from) : document.documentElement;
    const style = getComputedStyle(from);
    const values = cell.dataset.var.split(',').map(v => style.getPropertyValue(v.trim()).trim());
    const text = values.join(cell.dataset.join || ' / ') + (cell.dataset.after || '');
    if (cell.dataset.kind === 'color') {
      const dot = document.createElement('span');
      dot.className = 'swatch';
      dot.style.background = values[0];
      cell.append(dot);
    }
    cell.append(text);
  }
})();

// In the "View larger" popup (the viewer sets window.__viewer), show only the component:
// the spec stays on the page itself, but nothing below the fold to scroll to here.
if (window.__viewer || window.self !== window.top) {   // any embed: the grid cards and the View larger popup
  document.querySelector('.spec')?.remove();
  document.documentElement.style.overflow = 'hidden';
}
