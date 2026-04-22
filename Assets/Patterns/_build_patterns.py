"""
Build seamless tileable PNG patterns for inflatable balloon decor site.

Palette is derived from ./Gallery/Patterns reference swatches (see _sample_colors.py).
All tile outputs are verified seamless by wrapping draw space with modulo math or by
warping along a full-period sine so the right edge matches the left.

Outputs land next to this script in:
    Assets/Patterns/

Files:
    pattern-checker.png    800x800   warped pink checker, tileable
    pattern-scallops.png   800x800   staggered fish-scale arches, tileable
    pattern-daisies.png    1000x1000 scattered daisies, transparent, tileable (wrap)
    pattern-squiggles.png  1200x600  sine wave bands, tileable H+V
    pattern-hearts.png     800x800   scattered hearts + bows, transparent, tileable
    banner-swirl.png       2400x600  lush gradient swirl banner (one-shot, not tile)
"""
from __future__ import annotations

import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np

OUT = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/Websites/inflatabledecorations/Assets/Patterns"
os.makedirs(OUT, exist_ok=True)

# ---- Palette (sampled from reference swatches) ------------------------------
# Checker (482461816): hot pink + baby pink
CHK_HOT = (252, 96, 144)      # #fc6090
CHK_BABY = (252, 192, 204)    # #fcc0cc

# Scallops (627117156): pink gradient rings
SC_LIGHT = (252, 192, 216)    # #fcc0d8
SC_MID = (240, 156, 192)      # #f09cc0
SC_DEEP = (240, 96, 144)      # #f06090
SC_CREAM = (252, 240, 240)    # cream gap

# Daisies (522661344): petals / centers / accents
DAISY_CREAM = (252, 240, 228)     # petals
DAISY_WHITE = (252, 244, 240)
DAISY_HOTPINK = (252, 108, 180)   # centers
DAISY_PINK = (240, 108, 180)
DAISY_SOFT = (240, 192, 204)      # alt petals

# Squiggles (482318551): pink / hot pink / cream / orange bands
SQ_CREAM = (252, 228, 216)
SQ_PEACH = (252, 180, 156)
SQ_PINK = (252, 108, 144)
SQ_ORANGE = (252, 108, 12)
SQ_HOTPINK = (240, 108, 144)

# Hearts + bows (625035720): pinks with red accents (red pulled from 588526194)
HE_HOTPINK = (252, 132, 168)
HE_PINK = (240, 132, 168)
HE_LIGHT = (252, 216, 228)
HE_RED = (228, 60, 48)

# Swirl banner (624760489): peach / pink / coral / cream
SW_ORANGE = (240, 144, 84)
SW_PEACH = (252, 192, 168)
SW_PINK = (240, 156, 180)
SW_CORAL = (240, 168, 168)
SW_CREAM = (252, 232, 220)
SW_BG = (252, 240, 232)

# ---- utilities --------------------------------------------------------------

def save(im: Image.Image, name: str):
    path = os.path.join(OUT, name)
    im.save(path, "PNG", optimize=True)
    size = os.path.getsize(path)
    print(f"  wrote {name}  {im.size[0]}x{im.size[1]}  {size/1024:.1f} KB")


def tile_check(im: Image.Image, grid=(2, 2)) -> Image.Image:
    """Return a grid tiling of im for visual seam inspection."""
    gw, gh = grid
    w, h = im.size
    out = Image.new(im.mode, (w * gw, h * gh))
    for y in range(gh):
        for x in range(gw):
            out.paste(im, (x * w, y * h))
    return out


# ---- 1. Warped checker ------------------------------------------------------

def build_checker(size=800, cells=6):
    """Warped checker that tiles. Warp uses sin with full period over `size` so
    the displacement at x=0 equals x=size, guaranteeing seam match."""
    W = H = size
    # Start from an undistorted checker with exactly `cells` squares across/down.
    cell = size / cells
    base = Image.new("RGB", (W, H), CHK_BABY)
    d = ImageDraw.Draw(base)
    for cy in range(cells):
        for cx in range(cells):
            if (cx + cy) % 2 == 0:
                x0 = cx * cell
                y0 = cy * cell
                d.rectangle([x0, y0, x0 + cell, y0 + cell], fill=CHK_HOT)

    # Soften checker edges a touch for a hand-drawn feel
    base = base.filter(ImageFilter.GaussianBlur(0.6))

    arr = np.array(base)

    # Build displacement maps. Period = size (so dx(0) == dx(W)).
    y_idx, x_idx = np.indices((H, W), dtype=np.float32)
    k = 2 * math.pi / size
    amp_x = 14.0
    amp_y = 14.0
    dx = amp_x * np.sin(k * y_idx * 2.0)          # varies with y, periodic in y
    dy = amp_y * np.sin(k * x_idx * 2.0)          # varies with x, periodic in x

    src_x = (x_idx + dx) % W
    src_y = (y_idx + dy) % H

    # Bilinear sample with wrap
    x0 = np.floor(src_x).astype(np.int32) % W
    y0 = np.floor(src_y).astype(np.int32) % H
    x1 = (x0 + 1) % W
    y1 = (y0 + 1) % H
    fx = (src_x - x0)[..., None]
    fy = (src_y - y0)[..., None]
    a = arr[y0, x0].astype(np.float32)
    b = arr[y0, x1].astype(np.float32)
    c = arr[y1, x0].astype(np.float32)
    d2 = arr[y1, x1].astype(np.float32)
    top = a * (1 - fx) + b * fx
    bot = c * (1 - fx) + d2 * fx
    out = top * (1 - fy) + bot * fy
    out = np.clip(out, 0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGB")


# ---- 2. Scallops ------------------------------------------------------------

def build_scallops(size=800):
    """Classic fish-scale / scalloped arches.

    Approach: draw half-disks (pointing UP) in rows so each row's upper half
    covers the lower half of the row above. We stagger every other row by half
    a column. The row pitch is row_h = 2*radius*(1 - overlap_frac), and we pick
    cols and radius so W = cols * col_w (perfect horizontal tile) and H is an
    integer multiple of row_h (perfect vertical tile).
    """
    W = H = size
    cols = 8
    col_w = W / cols
    radius = col_w / 2  # half-disk radius equals half a column => arches touch
    # Vertical pitch: each row shows ~60% of the circle above what the next row covers.
    # Using pitch = radius * 0.75 gives a nice overlap (arches reveal ~75% of radius).
    # Need pitch to divide H evenly.
    desired_pitch = radius * 0.75  # 37.5px for W=800
    # Pick number of rows so pitch ~ desired, AND rows is even so the
    # stagger (every other row offset) repeats cleanly at the tile boundary.
    rows = round(H / desired_pitch)
    if rows % 2 == 1:
        rows += 1
    pitch = H / rows  # exact — guarantees vertical tile

    # Start with darkest background (so scallops appear as lighter arches layered)
    im = Image.new("RGB", (W, H), SC_DEEP)
    d = ImageDraw.Draw(im)

    def wrap_pieslice(cx, cy, r, start, end, fill):
        for ox in (-W, 0, W):
            for oy in (-H, 0, H):
                d.pieslice(
                    [cx + ox - r, cy + oy - r, cx + ox + r, cy + oy + r],
                    start=start, end=end, fill=fill,
                )

    # Draw from top down so each row overlaps the one above.
    # Use rows+2 and range -1.. to ensure edges wrap.
    for ry in range(-1, rows + 2):
        offset = (col_w / 2) if (ry % 2 == 1) else 0
        cy = ry * pitch
        for cx_i in range(-1, cols + 1):
            cx = cx_i * col_w + offset + col_w / 2
            # Each arch is the TOP HALF of a disk.
            # Concentric bands for the gradient scalloped look: outer deep, then mid, then light, highlight cream.
            # PIL pieslice angle: 0=east, 90=south, so top half = 180..360.
            wrap_pieslice(cx, cy, radius * 1.02, 180, 360, SC_DEEP)   # outline ring
            wrap_pieslice(cx, cy, radius * 0.92, 180, 360, SC_MID)
            wrap_pieslice(cx, cy, radius * 0.70, 180, 360, SC_LIGHT)
            wrap_pieslice(cx, cy, radius * 0.42, 180, 360, SC_CREAM)
            wrap_pieslice(cx, cy, radius * 0.18, 180, 360, SC_LIGHT)  # tiny center dot

    im = im.filter(ImageFilter.GaussianBlur(0.5))
    return im


# ---- 3. Daisies -------------------------------------------------------------

def draw_daisy(draw: ImageDraw.ImageDraw, cx, cy, r, petal_color, center_color,
               rotation_deg=0):
    """Draw a 5-petal daisy centered at (cx, cy) with petal tip radius r."""
    petals = 5
    petal_len = r
    petal_w = r * 0.58
    rot = math.radians(rotation_deg)
    for i in range(petals):
        a = rot + (2 * math.pi * i / petals)
        # petal is an ellipse with its long axis pointing away from center
        px = cx + math.cos(a) * petal_len * 0.55
        py = cy + math.sin(a) * petal_len * 0.55
        # bounding box (axis-aligned approximation — looks fine because of overlap)
        draw.ellipse(
            [px - petal_w / 2, py - petal_len / 2,
             px + petal_w / 2, py + petal_len / 2],
            fill=petal_color,
        )
    # center
    cr = r * 0.28
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=center_color)


def build_daisies(size=1000):
    W = H = size
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    rng = random.Random(7)
    # Scatter with Poisson-ish spacing using a simple grid-jitter approach
    grid = 5
    cell = W / grid
    for gy in range(grid):
        for gx in range(grid):
            cx = gx * cell + cell / 2 + rng.uniform(-cell * 0.3, cell * 0.3)
            cy = gy * cell + cell / 2 + rng.uniform(-cell * 0.3, cell * 0.3)
            r = rng.uniform(55, 85)
            petal = rng.choice([DAISY_CREAM, DAISY_WHITE, DAISY_SOFT])
            center = rng.choice([DAISY_HOTPINK, DAISY_PINK])
            rot = rng.uniform(0, 72)
            # Wrap draw: if daisy's bounding box crosses an edge, also draw at +/- W/H
            for ox in (-W, 0, W):
                for oy in (-H, 0, H):
                    if abs(ox) + abs(oy) == 0 or (
                        cx + ox + r > -5 and cx + ox - r < W + 5
                        and cy + oy + r > -5 and cy + oy - r < H + 5
                    ):
                        draw_daisy(d, cx + ox, cy + oy, r, petal, center, rot)

    # Soften edges
    im = im.filter(ImageFilter.GaussianBlur(0.5))
    return im


# ---- 4. Squiggle bands ------------------------------------------------------

def build_squiggles(w=1200, h=600):
    """Horizontal sine-wave bands, colored stripes stacked vertically.
    Tile H: sine period divides W exactly.
    Tile V: bands stack to exactly H and wrap (last band at bottom matches first at top)."""
    im = Image.new("RGB", (w, h), SQ_CREAM)
    arr = np.array(im)

    # Colors ordered top-to-bottom. First and last same for vertical wrap.
    band_colors = [SQ_CREAM, SQ_PEACH, SQ_PINK, SQ_ORANGE, SQ_HOTPINK, SQ_PEACH, SQ_CREAM]
    n_bands = len(band_colors) - 1  # last wraps to first
    band_h = h / n_bands

    # Sine wave: 4 full periods across width, so period = w/4 — tiles horizontally
    periods = 4
    amp = 18  # pixels
    k = 2 * math.pi * periods / w

    y_idx, x_idx = np.indices((h, w), dtype=np.float32)
    # Displace y by a sine of x so the bands waver
    wave = amp * np.sin(k * x_idx)
    eff_y = (y_idx + wave) % h  # wrap so vertical is seamless

    # For each row figure out which band you're in based on eff_y
    band_idx = (eff_y / band_h).astype(np.int32)
    band_idx = np.clip(band_idx, 0, n_bands - 1)

    # Additionally carve thin squiggle lines inside each band: a second, thinner,
    # out-of-phase sine that draws a darker line.
    # Build final color array
    out = np.zeros((h, w, 3), dtype=np.uint8)
    pal = np.array(band_colors[:-1], dtype=np.uint8)  # drop the wrap duplicate
    out[:] = pal[band_idx]

    # Draw a thin red-ish squiggle line through the middle of each band
    line_color = np.array([228, 60, 48], dtype=np.uint8)  # from swatch 588526194
    for bi in range(n_bands):
        center_y = (bi + 0.5) * band_h
        # phase alternates per band so lines don't all align
        phase = bi * math.pi / 3
        line_y = center_y + (amp * 0.7) * np.sin(k * x_idx[0] + phase)
        line_y = line_y % h
        # draw 2-px thick line with wrap
        for dy in (-1, 0, 1):
            yy = (line_y.astype(np.int32) + dy) % h
            xx = np.arange(w)
            out[yy, xx] = line_color

    im = Image.fromarray(out, "RGB")
    # Very slight blur to smooth antialias
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    return im


# ---- 5. Hearts + bows -------------------------------------------------------

def draw_heart(draw: ImageDraw.ImageDraw, cx, cy, size, color):
    """Draw a classic heart centered at (cx, cy). `size` = overall width."""
    r = size * 0.28
    # two circles for the lobes
    lx = cx - size * 0.22
    rx = cx + size * 0.22
    ly = cy - size * 0.1
    draw.ellipse([lx - r, ly - r, lx + r, ly + r], fill=color)
    draw.ellipse([rx - r, ly - r, rx + r, ly + r], fill=color)
    # triangle for the bottom point
    pts = [
        (cx - size * 0.48, cy - size * 0.05),
        (cx + size * 0.48, cy - size * 0.05),
        (cx, cy + size * 0.5),
    ]
    draw.polygon(pts, fill=color)


def draw_bow(draw: ImageDraw.ImageDraw, cx, cy, size, color):
    """Tiny bow tie shape."""
    w = size
    h = size * 0.6
    # left triangle
    draw.polygon([
        (cx - w * 0.5, cy - h * 0.5),
        (cx, cy),
        (cx - w * 0.5, cy + h * 0.5),
    ], fill=color)
    # right triangle
    draw.polygon([
        (cx + w * 0.5, cy - h * 0.5),
        (cx, cy),
        (cx + w * 0.5, cy + h * 0.5),
    ], fill=color)
    # knot
    kr = size * 0.12
    draw.ellipse([cx - kr, cy - kr, cx + kr, cy + kr], fill=color)


def build_hearts(size=800):
    W = H = size
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rng = random.Random(13)

    # Place hearts on a jittered grid — large jitter only (no row offset,
    # because a per-row stagger breaks seamless wrap across the tile boundary).
    grid = 6
    cell = W / grid
    for gy in range(grid):
        for gx in range(grid):
            cx = gx * cell + cell / 2 + rng.uniform(-cell * 0.42, cell * 0.42)
            cy = gy * cell + cell / 2 + rng.uniform(-cell * 0.42, cell * 0.42)
            kind = rng.choices(["heart_big", "heart_small", "bow", "heart_red"],
                               weights=[4, 3, 2, 1])[0]
            if kind == "heart_big":
                s = rng.uniform(70, 95)
                c = rng.choice([HE_HOTPINK, HE_PINK])
                fn = draw_heart
            elif kind == "heart_small":
                s = rng.uniform(40, 60)
                c = HE_LIGHT
                fn = draw_heart
            elif kind == "heart_red":
                s = rng.uniform(35, 50)
                c = HE_RED
                fn = draw_heart
            else:
                s = rng.uniform(45, 65)
                c = rng.choice([HE_HOTPINK, HE_RED])
                fn = draw_bow

            # wrap draw for seamlessness
            for ox in (-W, 0, W):
                for oy in (-H, 0, H):
                    fn(d, cx + ox, cy + oy, s, c)

    im = im.filter(ImageFilter.GaussianBlur(0.4))
    return im


# ---- 6. Swirl banner --------------------------------------------------------

def build_swirl(w=2400, h=600):
    """Lush painterly blob composition for a hero band. Not required to tile."""
    # Start from a soft vertical gradient background
    bg = np.zeros((h, w, 3), dtype=np.float32)
    top = np.array(SW_BG, dtype=np.float32)
    bottom = np.array(SW_CREAM, dtype=np.float32)
    for y in range(h):
        t = y / (h - 1)
        bg[y, :] = top * (1 - t) + bottom * t
    im = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    # Stamp a bunch of soft translucent circles to build the swirl
    rng = random.Random(21)
    stamp_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    colors = [SW_ORANGE, SW_PEACH, SW_PINK, SW_CORAL, (252, 168, 144), (240, 120, 108)]

    for _ in range(65):
        cx = rng.uniform(-100, w + 100)
        cy = rng.uniform(-50, h + 50)
        r = rng.uniform(120, 360)
        color = rng.choice(colors)
        alpha = rng.randint(55, 110)

        # Draw a circle on its own layer, blur it, then paste
        blob = Image.new("RGBA", (int(r * 2.4), int(r * 2.4)), (0, 0, 0, 0))
        bd = ImageDraw.Draw(blob)
        br = r * 1.0
        bcx = blob.size[0] / 2
        bcy = blob.size[1] / 2
        bd.ellipse([bcx - br, bcy - br, bcx + br, bcy + br],
                   fill=(color[0], color[1], color[2], alpha))
        blob = blob.filter(ImageFilter.GaussianBlur(r * 0.18))
        stamp_layer.alpha_composite(blob, (int(cx - blob.size[0] / 2),
                                           int(cy - blob.size[1] / 2)))

    im = Image.alpha_composite(im, stamp_layer)

    # Add a few brighter highlight blobs on top for lift
    hi_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for _ in range(18):
        cx = rng.uniform(0, w)
        cy = rng.uniform(0, h)
        r = rng.uniform(40, 140)
        blob = Image.new("RGBA", (int(r * 3), int(r * 3)), (0, 0, 0, 0))
        bd = ImageDraw.Draw(blob)
        bcx = blob.size[0] / 2
        bcy = blob.size[1] / 2
        bd.ellipse([bcx - r, bcy - r, bcx + r, bcy + r],
                   fill=(255, 236, 220, 90))
        blob = blob.filter(ImageFilter.GaussianBlur(r * 0.3))
        hi_layer.alpha_composite(blob, (int(cx - blob.size[0] / 2),
                                        int(cy - blob.size[1] / 2)))
    im = Image.alpha_composite(im, hi_layer)

    # Final gentle overall blur for cohesion
    im = im.filter(ImageFilter.GaussianBlur(1.0))
    return im.convert("RGB")


# ---- run everything ---------------------------------------------------------

def verify_seam(im: Image.Image, label: str):
    """Print the max per-channel diff between right edge & left edge, and bottom & top."""
    arr = np.array(im)
    # For RGBA skip alpha
    if arr.shape[2] == 4:
        arr = arr[..., :3]
    dh = np.abs(arr[:, 0, :].astype(int) - arr[:, -1, :].astype(int)).max()
    dv = np.abs(arr[0, :, :].astype(int) - arr[-1, :, :].astype(int)).max()
    print(f"  seam-check {label}: horizontal max delta={dh}  vertical max delta={dv}")


if __name__ == "__main__":
    print("building patterns...")

    p1 = build_checker(800, cells=6)
    save(p1, "pattern-checker.png")
    verify_seam(p1, "checker")

    p2 = build_scallops(800)
    save(p2, "pattern-scallops.png")
    verify_seam(p2, "scallops")

    p3 = build_daisies(1000)
    save(p3, "pattern-daisies.png")
    verify_seam(p3, "daisies")

    p4 = build_squiggles(1200, 600)
    save(p4, "pattern-squiggles.png")
    verify_seam(p4, "squiggles")

    p5 = build_hearts(800)
    save(p5, "pattern-hearts.png")
    verify_seam(p5, "hearts")

    p6 = build_swirl(2400, 600)
    save(p6, "banner-swirl.png")
    # swirl doesn't need to tile; no seam check

    # Emit 2x2 tile-test images to the same folder for quick eyeball
    save(tile_check(p1), "_tiletest-checker.png")
    save(tile_check(p2), "_tiletest-scallops.png")
    save(tile_check(p3), "_tiletest-daisies.png")
    save(tile_check(p4), "_tiletest-squiggles.png")
    save(tile_check(p5), "_tiletest-hearts.png")

    print("done.")
