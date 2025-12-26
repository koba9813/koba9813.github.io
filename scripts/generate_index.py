#!/usr/bin/env python3
"""Generate or update posts/index.json by scanning posts/*.md

Usage:
  python3 scripts/generate_index.py [--dry-run] [--write] [--posts-dir posts] [--index posts/index.json]
"""
import argparse
import json
import os
import re
from pathlib import Path
from datetime import datetime


def parse_filename(name):
    # returns (slug, lang or None)
    m = re.match(r"^(?P<slug>.+?)\.(?P<lang>[a-z]{2})\.md$", name, re.I)
    if m:
        return m.group('slug'), m.group('lang').lower()
    m = re.match(r"^(?P<slug>.+?)[-_](?P<lang>[a-z]{2})\.md$", name, re.I)
    if m:
        return m.group('slug'), m.group('lang').lower()
    m = re.match(r"^(?P<slug>.+?)\.md$", name, re.I)
    if m:
        return m.group('slug'), None
    return None, None


def extract_title_and_excerpt(path: Path):
    text = path.read_text(encoding='utf-8')
    title = None
    excerpt = None
    lines = text.splitlines()
    # find first H1
    for l in lines:
        m = re.match(r"^#\s+(.*)", l)
        if m:
            title = m.group(1).strip()
            break
    # find first paragraph (non-heading, non-empty)
    parts = re.split(r"\n\s*\n", text)
    for p in parts:
        s = p.strip()
        if not s:
            continue
        if re.match(r"^#", s):
            continue
        # take first paragraph as excerpt (single line)
        excerpt = ' '.join(s.splitlines()).strip()
        # remove markdown image links and keep plain text for brevity
        excerpt = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", excerpt)
        excerpt = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", excerpt)
        if len(excerpt) > 300:
            excerpt = excerpt[:297] + '...'
        break
    return title, excerpt


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--dry-run', action='store_true', default=False)
    p.add_argument('--write', action='store_true', default=False)
    p.add_argument('--posts-dir', default='posts')
    p.add_argument('--index', default='posts/index.json')
    args = p.parse_args()

    posts_dir = Path(args.posts_dir)
    index_path = Path(args.index)
    if not posts_dir.exists():
        print('posts dir not found:', posts_dir)
        return 1

    existing = {'posts': []}
    if index_path.exists():
        try:
            existing = json.loads(index_path.read_text(encoding='utf-8'))
        except Exception as e:
            print('Failed to read existing index:', e)
            return 1

    existing_slugs = {p.get('slug'): p for p in existing.get('posts', []) if p.get('slug')}

    # scan md files
    files = [f for f in posts_dir.iterdir() if f.is_file() and f.suffix.lower() == '.md']
    grouped = {}
    for f in files:
        slug, lang = parse_filename(f.name)
        if not slug:
            continue
        grouped.setdefault(slug, {})
        grouped[slug][lang or 'unspecified'] = f

    additions = []
    for slug, lang_map in grouped.items():
        if slug in existing_slugs:
            continue
        langs = [l for l in lang_map.keys() if l != 'unspecified']
        entry = {
            'slug': slug,
            'langs': sorted(langs) if langs else [],
            'tags': []
        }
        # pick a representative file to get date
        rep = next(iter(lang_map.values()))
        mtime = datetime.fromtimestamp(rep.stat().st_mtime).date().isoformat()
        entry['date'] = mtime

        # extract titles and excerpts per language
        for l, path in lang_map.items():
            if l == 'unspecified':
                title, excerpt = extract_title_and_excerpt(path)
                if title and 'title_en' not in entry and 'title_ja' not in entry:
                    entry['title_en'] = title
                if excerpt and 'excerpt_en' not in entry and 'excerpt_ja' not in entry:
                    entry['excerpt_en'] = excerpt
                continue
            title, excerpt = extract_title_and_excerpt(path)
            key_t = f'title_{l}'
            key_e = f'excerpt_{l}'
            if title:
                entry[key_t] = title
            if excerpt:
                entry[key_e] = excerpt

        additions.append(entry)

    if not additions:
        print('No new posts to add.')
        return 0

    print('Found', len(additions), 'new post(s):')
    for a in additions:
        print('-', a['slug'], 'langs=', a.get('langs'))

    if args.write:
        # append to existing posts list and sort by date desc
        existing.setdefault('posts', [])
        existing['posts'].extend(additions)
        try:
            existing['posts'].sort(key=lambda x: x.get('date',''), reverse=True)
        except Exception:
            pass
        index_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('Wrote', index_path)
    else:
        print('\nDry run: use --write to apply changes')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
