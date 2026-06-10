import io, sys, http.server, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

os.chdir(r"c:\Users\komar\Documents\ANTYGRAVITY\Komars_Place\Work\Coaching_Practice\website")
handler = http.server.SimpleHTTPRequestHandler
server = http.server.HTTPServer(("127.0.0.1", 8080), handler)
print(f"Server started at http://localhost:8080")
server.serve_forever()
