# insightfulessays.com

A short, opinionated list of essays that are actually insightful, each with one
paragraph on what makes it special. That paragraph is the product. The list is
the opposite of a feed: it grows by a handful of entries a year.

## Definition of done

- A static page at insightfulessays.com listing every entry, newest first,
  filterable by tag and searchable by text.
- Every entry links to the original and to a Wayback Machine snapshot that was
  requested at the moment the entry was added.
- Adding an entry from this machine is one command. Adding one from a phone is
  filling in a GitHub issue form. Nothing else to maintain.

## Adding an essay

From this machine:

```
./add https://example.com/essay --why "One paragraph on why it is special." --tags philosophy,music
```

That fetches the page, fills in title and author from the page's metadata (you
can override with `--title` and `--author`), asks the Wayback Machine to save
it, stores a private local snapshot under `archive/`, and appends the entry to
`essays.json`. Then `git commit` and `git push`; GitHub Pages does the rest.

From a phone: open a new issue with the "Add an essay" template. The workflow
runs the same script (Wayback save only, no local snapshot), commits the
entry, and closes the issue.

`./add --backfill-snapshots` fetches local snapshots for any entries that do
not have one, for entries that came in through the issue path.

## Layout

- `essays.json`: the data. One object per essay.
- `index.html`, `styles.css`, `app.js`: the site. No build step.
- `add`: the add script (Python 3, standard library only).
- `archive/`: private local snapshots, gitignored. The Wayback link is the
  public archive; these are a belt-and-braces backup on this machine only,
  because republishing full copies of other people's essays is not ours to do.
- `.github/`: the issue form and the workflow behind the phone path.

## Hosting

GitHub Pages from the repository root. Add a `CNAME` file containing
`insightfulessays.com` once the domain is bought and pointed at GitHub Pages.
