#!/usr/bin/env python3
"""Baixa e valida as imagens oficiais de padrões de MDF para a curadoria VA."""
import json
import logging
import os
import re
import sys
import time
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "materiais"
OUT.mkdir(parents=True, exist_ok=True)
DATA = json.loads((ROOT / "fontes-mdf.json").read_text(encoding="utf-8"))
S = requests.Session()
S.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; VA-MaterialCatalog/1.0; authorized product image retrieval)",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
})
LOG = []
ok = 0
for mat in DATA["materials"]:
    mid, name, url = mat["id"], mat["name"], mat["image"]
    dest = OUT / (mid + ".webp")
    saved = False
    err = ""
    for attempt in range(3):
        try:
            headers = {"Referer": mat["page"], "Accept": "image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"}
            res = S.get(url, headers=headers, timeout=35)
            res.raise_for_status()
            if len(res.content) < 100:
                raise ValueError("arquivo pequeno demais")
            image = Image.open(BytesIO(res.content))
            image.load()
            image = ImageOps.exif_transpose(image)
            if image.width < 250 or image.height < 200:
                raise ValueError(f"resolução insuficiente: {image.size}")
            if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
                bg = Image.new("RGBA", image.size, (250, 246, 241, 255))
                bg.alpha_composite(image.convert("RGBA"))
                image = bg.convert("RGB")
            else:
                image = image.convert("RGB")
            image.thumbnail((1300, 1100), Image.Resampling.LANCZOS)
            image.save(dest, "WEBP", quality=88, method=5)
            size = dest.stat().st_size
            if size < 150:
                raise ValueError("arquivo salvo muito pequeno")
            LOG.append({"id": mid, "name": name, "result": "ok", "width": image.width,
                        "height": image.height, "size_bytes": size, "origin": mat["page"],
                        "image_url": url})
            print(f"OK {mid:>3} {name:<28} {image.width}x{image.height} {size} bytes")
            ok += 1
            saved = True
            break
        except Exception as e:
            err = str(e)
            time.sleep(attempt + 1)
    if not saved:
        LOG.append({"id": mid, "name": name, "result": "failed", "error": err,
                    "origin": mat["page"], "image_url": url})
        print(f"FAIL {mid}: {name}: {err}", file=sys.stderr)

(ROOT / "relatorio-imagens.json").write_text(
    json.dumps({"expected": len(DATA["materials"]), "downloaded": ok, "results": LOG},
               ensure_ascii=False, indent=2),
    encoding="utf-8"
)
# Não alterar a página pública se alguma imagem não tiver sido validada.
if ok != len(DATA["materials"]):
    print(f"CATÁLOGO INCOMPLETO: {ok}/{len(DATA['materials'])}, a página pública permanece intacta.")
    sys.exit(0)

from bs4 import BeautifulSoup
html = (ROOT / "index.html").read_text(encoding="utf-8")
soup = BeautifulSoup(html, "html.parser")
cards = soup.select("label.material-card")
if len(cards) != len(DATA["materials"]):
    print("ERRO: a quantidade de cartões não corresponde ao catálogo, abortando atualização.")
    sys.exit(2)
norm = lambda s: re.sub(r"[^a-z0-9]+", "", __import__("unicodedata").normalize("NFKD",s).encode("ascii","ignore").decode().lower())
for card in cards:
    brand = card.select_one(".material-brand").get_text(" ", strip=True)
    name = card.select_one(".material-name").get_text(" ", strip=True)
    options = [m for m in DATA["materials"] if m["brand"] == brand and norm(name).startswith(norm(m["name"]))]
    if len(options) != 1:
        raise RuntimeError(f"Correspondência ambígua em {brand} {name}: {[o['id'] for o in options]}")
    m = options[0]
    thumb = card.select_one(".material-thumb")
    if not thumb:
        raise RuntimeError(f"Cartão sem área de imagem: {m['name']}")
    thumb.attrs.pop("style", None)
    thumb["class"] = ["material-thumb", "has-image"]
    thumb.clear()
    img = soup.new_tag("img", src=f"materiais/{m['id']}.webp", loading="lazy")
    img["alt"] = f"Fotografia oficial do padrão MDF {m['name']} — {brand}"
    img["width"] = "640"
    img["height"] = "400"
    thumb.append(img)
intro = soup.select_one(".catalog-intro .section-text")
if intro:
    intro.string = "Fotografias dos padrões disponibilizadas pelas fabricantes. Selecione os acabamentos de sua preferência; a escolha definitiva deverá ser confirmada em amostras físicas."
for badge in soup.select(".sample-badge"):
    badge.decompose()
# Caso a marca transparente tenha sido armazenada por este processo
logo = ROOT / "logo-va.webp"
if logo.exists():
    tag = soup.select_one(".logo-block img")
    if tag:
        tag["src"] = "logo-va.webp"
        tag["alt"] = "VA Arquitetura e Interiores"
    caption = soup.select_one(".logo-caption")
    if caption: caption.decompose()
    style = soup.new_tag("style")
    style.string = ".logo-block{border:none!important;background:transparent!important;box-shadow:none!important}.logo-block img{mix-blend-mode:normal!important;width:min(100%,420px)!important;max-height:350px!important}"
    soup.head.append(style)
(ROOT / "index.html").write_text(str(soup), encoding="utf-8")
print(f"PUBLICAÇÃO PRONTA: {ok} fotografias reais com nomes conferidos.")
