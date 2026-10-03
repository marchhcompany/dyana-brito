# Servidor local simples para visualizar o site (http://localhost:5173)
$root = Split-Path -Parent $PSScriptRoot
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:5173/")
$l.Start()
Write-Host "Servindo $root em http://localhost:5173"
$types = @{ ".html"="text/html; charset=utf-8"; ".js"="text/javascript"; ".css"="text/css"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".ico"="image/x-icon"; ".mp4"="video/mp4"; ".svg"="image/svg+xml"; ".xml"="application/xml"; ".txt"="text/plain"; ".webp"="image/webp" }
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart("/")
  if ($p -eq "" -or $p.EndsWith("/")) { $p += "index.html" }
  $f = Join-Path $root $p
  if (-not (Test-Path $f -PathType Leaf)) { $f = Join-Path $root "index.html" }
  try {
    $bytes = [IO.File]::ReadAllBytes($f)
    $ext = [IO.Path]::GetExtension($f).ToLower()
    $c.Response.ContentType = $(if ($types[$ext]) { $types[$ext] } else { "application/octet-stream" })
    $c.Response.Headers.Add("Cache-Control", "no-store")
    $c.Response.ContentLength64 = $bytes.Length
    $c.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {} finally { $c.Response.Close() }
}
