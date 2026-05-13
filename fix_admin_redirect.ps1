$f = 'c:\Users\meetd\Downloads\City Real Space\login.html'
$lines = Get-Content $f -Encoding UTF8
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match "alert.*Admin login ke liye") {
    $lines[$i] = "        window.location.href = '/admin/index.html';"
  }
  if ($lines[$i] -match "msg\.textContent.*Admin login ke liye") {
    $lines[$i] = "        window.location.href = '/admin/index.html';"
  }
}
Set-Content $f $lines -Encoding UTF8
Write-Host 'Done'
