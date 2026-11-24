#!/usr/bin/env python3
"""
Gera ícones .ico reais para os wrappers desktop da VIXT.
Sem dependências externas: escreve um arquivo ICO contendo uma imagem PNG.
Uso: python3 make-icons.py
"""
import struct
import zlib
from pathlib import Path

HERE = Path(__file__).resolve().parent
SIZES = [16, 32, 48, 64, 128, 256]

ICONS = {
    "vixt-oficina.ico": ((37, 99, 235), (6, 182, 212)),   # azul tecnológico
    "vixt-barbearia.ico": ((15, 23, 42), (37, 99, 235)),   # escuro + azul
}


def png_chunk(tag: bytes, data: bytes) -> bytes:
    return (struct.pack(">I", len(data)) + tag + data +
            struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))


def make_png(size: int, color_a, color_b) -> bytes:
    """Gradiente diagonal com um raio branco estilizado (monograma VIXT)."""
    raw = bytearray()
    for y in range(size):
        raw.append(0)  # filtro PNG None
        for x in range(size):
            t = (x + y) / (2 * max(size - 1, 1))
            r = round(color_a[0] * (1 - t) + color_b[0] * t)
            g = round(color_a[1] * (1 - t) + color_b[1] * t)
            b = round(color_a[2] * (1 - t) + color_b[2] * t)
            # barra de energia inclinada no centro
            cx = size / 2
            if abs((x - cx) + (y - size / 2) * 0.5) < size * 0.045 and size * 0.22 < y < size * 0.78:
                r, g, b = 255, 255, 255
            raw.extend((r, g, b, 255))
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", ihdr) +
            png_chunk(b"IDAT", zlib.compress(bytes(raw), 9)) +
            png_chunk(b"IEND", b""))


def make_ico(images: list[tuple[int, bytes]]) -> bytes:
    header = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries = bytearray()
    blobs = bytearray()
    for size, png in images:
        entries += struct.pack(
            "<BBBBHHII",
            size if size < 256 else 0,
            size if size < 256 else 0,
            0, 0, 1, 32, len(png), offset,
        )
        blobs += png
        offset += len(png)
    return header + bytes(entries) + bytes(blobs)


for filename, (color_a, color_b) in ICONS.items():
    images = [(s, make_png(s, color_a, color_b)) for s in SIZES]
    (HERE / filename).write_bytes(make_ico(images))
    print(f"gerado: {filename}")
