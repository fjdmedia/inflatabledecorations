"""Sample dominant colors from each reference swatch using k-means-lite (bucket quantization)."""
import os
import glob
from collections import Counter
from PIL import Image

SRC = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/Websites/inflatabledecorations/Assets/Gallery/Patterns"


def sample(path, k=8):
    im = Image.open(path).convert("RGB")
    # Downsize for speed and use center crop to avoid white background border
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    im = im.crop((left, top, left + side, top + side))
    im = im.resize((120, 120))
    # Mask to a circle so the white corners (outside the circular crop) are ignored
    px = im.load()
    cx, cy = 60, 60
    r2 = 55 * 55
    buckets = Counter()
    for y in range(120):
        for x in range(120):
            dx, dy = x - cx, y - cy
            if dx * dx + dy * dy > r2:
                continue
            r, g, b = px[x, y]
            # Skip near-white pixels (likely jpeg artifact outside circle)
            if r > 245 and g > 245 and b > 245:
                continue
            # Quantize to 24 bucket levels per channel
            qr = (r // 12) * 12
            qg = (g // 12) * 12
            qb = (b // 12) * 12
            buckets[(qr, qg, qb)] += 1
    return buckets.most_common(k)


files = sorted(glob.glob(os.path.join(SRC, "*.jpg")))
for f in files:
    name = os.path.basename(f).split("_")[0]
    top = sample(f)
    print(name)
    for (r, g, b), n in top:
        print(f"  #{r:02x}{g:02x}{b:02x}  ({r:3d},{g:3d},{b:3d})  x{n}")
    print()
