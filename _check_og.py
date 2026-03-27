import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from PIL import Image
img = Image.open(r'img/og-image.jpg')
print(f'Size: {img.size[0]}x{img.size[1]}')
print(f'Format: {img.format}')
print(f'File size: {__import__("os").path.getsize(r"img/og-image.jpg")} bytes')
