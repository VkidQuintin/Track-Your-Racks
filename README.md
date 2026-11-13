# Stack Your Racks 💸

> Small savings, big moves.

**Stack Your Racks** is a browser-based savings challenge tracker. Enter how much you earn, set a savings goal and a time frame, and the app generates a grid of "boxes", each one an amount to set aside. Tick the boxes off as you save, watch the progress bar fill, and celebrate with confetti when you hit your goal.

Built with plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

## Features

- **Weekly or monthly earners**: the savings plan adapts to your pay cycle.
- **Smart defaults**: leave the goal blank and it uses 10% of your earnings; leave the duration blank and it picks a sensible period.
- **Flexible duration**: choose days, weeks, months or years.
- **Savings matrix**: one clickable box per pay period; the last box is adjusted so the total matches your goal exactly.
- **Live progress**: saved amount, goal and percentage bar update as you tick (and un-tick) boxes.
- **Celebration**: a congratulations modal with confetti when the goal is reached.
- **Tips and suggestions**: a random savings tip and suggestion each time you generate.
- **Responsive dark UI**: collapsible right sidebar, hamburger menu, mobile layout.

## Getting started

1. Keep these files together in one folder:
   ```
   index.html
   style.css
   main.js
   ```
2. Open `index.html` in any modern browser.

Or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How to use

1. Pick your **Payment Frequency** (Weekly or Monthly).
2. Enter your **Earnings** (minimum R100).
3. *(Optional)* Enter a **Savings Goal** (minimum R100). Default: 10% of earnings.
4. *(Optional)* Set a **Goal Duration** and unit. Default: 30 days for monthly earners, 2 to 4 weeks for weekly earners depending on goal size.
5. Click **Generate My Matrix**.
6. Click each box once you've saved that amount. Reach 100% to trigger the celebration.

### How the plan is calculated

| Frequency | Number of boxes   | Box amount   |
|-----------|-------------------|--------------|
| Weekly    | `ceil(days / 7)`  | goal ÷ boxes |
| Monthly   | `ceil(days / 30)` | goal ÷ boxes |

Months count as 30 days and years as 365. Box amounts are rounded up to the cent and the final box absorbs the remainder.

## Project structure

| File         | Purpose                                                          |
|--------------|------------------------------------------------------------------|
| `index.html` | Page structure: menu, sidebar form, matrix section, modal        |
| `style.css`  | Dark theme, layout, animations, responsive rules                 |
| `main.js`    | Menu/sidebar behaviour, plan calculation, progress, confetti     |

## Customising

- **Theme colours**: edit the CSS variables at the top of `style.css` (`--primary`, `--bg`, `--card`).
- **Tips and suggestions**: edit the arrays in the `generate-btn` handler in `main.js`.
- **Minimums**: change the `100` checks in `main.js` and the `min` attributes in `index.html`.

## Known limitations

- Progress isn't saved; refreshing the page resets the matrix.
- Menu links (Home, Accounts, Settings, Help) are placeholders.
- Currency is hard-coded to South African Rand (R).
- On narrow screens the hamburger button opens both the menu and the sidebar.

## Ideas for next steps

- Persist progress with `localStorage`.
- Build real Accounts/Settings views.
- Support multiple currencies.
