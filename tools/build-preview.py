#!/usr/bin/env python3
"""Pack the whole site into ONE self-contained HTML file, for publishing
as a Claude artifact so the owner can preview a change like the real site.

    python3 tools/build-preview.py <output.html>

What it does, and why:
- inlines styles.css and site.js verbatim (an artifact is a single file;
  it cannot load anything else, from disk or from the internet)
- embeds the two background photos (img/bg-0.jpg, img/bg-1.jpg) as data URIs
- swaps every other photograph for a black SVG rectangle with the SAME
  pixel dimensions as the real image, so layout is identical while the
  file stays small; a fixed banner labels the page as a preview
- downloads the Google fonts (latin + cyrillic subsets) and embeds them
  as data-URI @font-face rules — the artifact page cannot reach Google
- rewrites relative PDF links to the live site so they still open
- emits PURE ASCII (non-ASCII text becomes HTML entities): the artifact
  host controls the page's encoding declaration, so raw Cyrillic or
  em-dashes would render as mojibake

Requires: python3 and curl, network access to fonts.googleapis.com/gstatic.
"""
import base64, html, os, re, struct, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIVE = 'https://darjafilippova.com'


def jpeg_size(path):
    with open(path, 'rb') as f:
        data = f.read()
    i = 2
    while i < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            h, w = struct.unpack('>HH', data[i + 5:i + 9])
            return w, h
        if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
            i += 2
            continue
        i += 2 + struct.unpack('>H', data[i + 2:i + 4])[0]
    return 1600, 1200


def datauri(path, mime):
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read()).decode())


def black_placeholder(w, h):
    svg = ("<svg xmlns='http://www.w3.org/2000/svg' width='%d' height='%d'>"
           "<rect width='100%%' height='100%%' fill='%%23000'/></svg>") % (w, h)
    return 'data:image/svg+xml,' + svg.replace('<', '%3C').replace('>', '%3E')


def fetch(url):
    out = subprocess.run(
        ['curl', '-sS', '-m', '30',
         '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
               '(KHTML, like Gecko) Chrome/125.0 Safari/537.36',
         '-o', '-', url], capture_output=True)
    if out.returncode != 0 or not out.stdout:
        sys.exit('download failed: %s\n%s' % (url, out.stderr.decode()))
    return out.stdout


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__.strip().splitlines()[2].strip())
    out_path = sys.argv[1]

    with open(os.path.join(ROOT, 'index.html')) as f:
        page = f.read()

    # ---- fonts: the URL index.html really uses; latin + cyrillic subsets ----
    fonts_url = html.unescape(
        re.search(r'href="(https://fonts\.googleapis\.com/css2[^"]+)"', page).group(1))
    fonts_css = fetch(fonts_url).decode()
    kept = []
    for block in re.findall(r'@font-face\s*\{[^}]*\}', fonts_css):
        if 'U+0000-00FF' not in block and 'U+0400-045F' not in block:
            continue  # skip latin-ext / vietnamese / greek subsets
        url = re.search(r'url\((https://[^)]+)\)', block).group(1)
        uri = 'data:font/woff2;base64,' + base64.b64encode(fetch(url)).decode()
        kept.append(block.replace(url, uri))
    font_css = '\n'.join(kept)
    print('fonts embedded: %d faces' % len(kept), file=sys.stderr)

    # ---- styles.css with the two backgrounds embedded ----
    with open(os.path.join(ROOT, 'styles.css')) as f:
        css = f.read()
    for bg in ('bg-0.jpg', 'bg-1.jpg'):
        css = css.replace('url("img/%s")' % bg,
                          'url("%s")' % datauri(os.path.join(ROOT, 'img', bg), 'image/jpeg'))
    css = css.replace('@charset "utf-8";', '')

    # ---- body, with photos swapped for identically-sized black rectangles ----
    body = re.search(r'<body>(.*)</body>', page, re.S).group(1)

    def swap_img(m):
        w, h = jpeg_size(os.path.join(ROOT, m.group(1)))
        return 'src="%s"' % black_placeholder(w, h)
    body, n = re.subn(r'src="(img/[^"]+)"', swap_img, body)
    print('photos replaced: %d' % n, file=sys.stderr)

    body = re.sub(r'href="([^"]+\.pdf)"', r'href="%s/\1"' % LIVE, body)
    body = re.sub(r'<script[^>]*></script>', '', body)

    with open(os.path.join(ROOT, 'site.js')) as f:
        js = f.read()

    # pure ASCII everywhere (see module docstring)
    body = body.encode('ascii', 'xmlcharrefreplace').decode()
    css = css.replace('—', '--').replace('→', '->')
    if any(ord(c) > 127 for c in css):
        sys.exit('new non-ASCII in styles.css: replace it with a CSS escape here first')
    js = js.encode('ascii', 'backslashreplace').decode()

    with open(out_path, 'w') as f:
        f.write('<title>Dasha Filippova &#8212; site preview</title>\n')
        f.write('<style>\n' + font_css + '\n' + css + '\n'
                '/* preview-only: banner explaining the black rectangles */\n'
                '.preview-note { position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;'
                ' background: rgba(29,21,16,0.92); color: #EDE6D6;'
                ' font-family: "IBM Plex Mono", monospace; font-size: 0.64rem;'
                ' letter-spacing: 0.08em; text-align: center; padding: 8px 16px; }\n'
                '</style>\n')
        f.write(body)
        f.write('<div class="preview-note">PREVIEW &#8212; black rectangles stand in for'
                ' the photographs; everything else is the real site</div>\n')
        f.write('<script>\n' + js + '\n</script>\n')
    print('written: %s (%d KB)' % (out_path, os.path.getsize(out_path) // 1024),
          file=sys.stderr)


if __name__ == '__main__':
    main()
