# Escanea ./img, detecta imágenes que aún no están en gallery-data.js y muestra
# su nombre y dimensiones (listas para pegar en el array GALLERY).
# Uso:  powershell -ExecutionPolicy Bypass -File .\scan-img.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$data = Get-Content (Join-Path $root "gallery-data.js") -Raw -Encoding UTF8
$exts = ".png", ".jpg", ".jpeg", ".webp", ".gif"
$nuevas = 0
Get-ChildItem (Join-Path $root "img") -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object { [regex]::Replace($_.Name, '\d+', { $args[0].Value.PadLeft(8, '0') }) } | ForEach-Object {
  if ($data -notmatch [regex]::Escape("img/" + $_.Name)) {
    try {
      $i = [System.Drawing.Image]::FromFile($_.FullName)
      "{ src: `"img/$($_.Name)`", w: $($i.Width), h: $($i.Height) }   # $([math]::Round($_.Length/1KB)) KB"
      $i.Dispose()
    } catch { "{ src: `"img/$($_.Name)`" }   # (sin dimensiones: formato no legible por System.Drawing)" }
    $nuevas++
  }
}
if ($nuevas -eq 0) { "No hay imágenes nuevas en ./img." } else { "`n$nuevas imagen(es) nueva(s) sin registrar." }
