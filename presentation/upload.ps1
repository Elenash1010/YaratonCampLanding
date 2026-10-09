param([string]$Manifest)
$ErrorActionPreference = 'Stop'
$items = Get-Content -LiteralPath $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($item in $items) {
  $ext = [IO.Path]::GetExtension($item.path)
  $mime = if ($ext -eq '.png') {'image/png'} elseif ($ext -eq '.svg') {'image/svg+xml'} else {'image/jpeg'}
  $response = Invoke-RestMethod -Uri $item.submitUrl -Method Post -InFile $item.path -ContentType $mime
  $response | ConvertTo-Json -Depth 8 -Compress
}
