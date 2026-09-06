# insightfulessays.com

A short, opinionated list of essays that are actually insightful, each with one
paragraph on what makes it special. That paragraph is the product. The list is
the opposite of a feed: it grows by a handful of entries a year.

## Definition of done

- A static page at insightfulessays.com listing every entry, newest first,
  filterable by tag and searchable by text, with an Atom feed.
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
`essays.json`, and rewrites `feed.xml`. Then `git commit`, `git push`, and
`wrangler deploy`.

From a phone: open a new issue with the "Add an essay" template. The workflow
runs the same script (Wayback save only, no local snapshot), commits the
entry, and closes the issue.

`./add --backfill-snapshots` fetches local snapshots for any entries that do
not have one, for entries that came in through the issue path.

`./add --feed` regenerates `feed.xml` alone.

## Layout

- `essays.json`: the data. One object per essay. `published` is the essay's
  own date where the page states one (a year is enough); `added` is when it
  joined the list.
- `feed.xml`: Atom feed of the list, written by `add`.
- `index.html`, `styles.css`, `app.js`: the site. No build step.
- `add`: the add script (Python 3, standard library only).
- `archive/`: private local snapshots, gitignored. The Wayback link is the
  public archive; these are a belt-and-braces backup on this machine only,
  because republishing full copies of other people's essays is not ours to do.
- `.github/`: the issue form and the workflow behind the phone path.

## Hosting

Cloudflare Workers static assets (`wrangler.jsonc`). Deploy by hand with
`wrangler deploy` from a checkout. The GitHub Actions deploy was removed on
2026-09-06 because the `CLOUDFLARE_API_TOKEN` secret is not set and every push
failed; put it back (cloudflare/wrangler-action with the token and
`CLOUDFLARE_ACCOUNT_ID`) once the token exists. Until then, an essay added
through the issue form is committed but not live until someone deploys.
Add insightfulessays.com as a custom domain on the Worker once it is bought.
