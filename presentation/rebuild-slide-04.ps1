$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$svg = [Text.StringBuilder]::new()
[void]$svg.AppendLine('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><filter id="shadow" x="-15%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.07"/></filter></defs><rect width="1920" height="1080" fill="white"/>')
function Add-Text([string[]]$Lines, [int]$X, [int]$Y, [int]$Size, [int]$LineHeight, [string]$Color='#222222', [int]$Weight=400) {
  [void]$svg.AppendLine("<text x='$X' y='$Y' font-family='Montserrat, Arial, sans-serif' font-size='$Size' font-weight='$Weight' fill='$Color'>")
  for ($j=0; $j -lt $Lines.Count; $j++) {
    $lineY=$Y+$j*$LineHeight
    $escaped=[Security.SecurityElement]::Escape($Lines[$j])
    [void]$svg.AppendLine("<tspan x='$X' y='$lineY'>$escaped</tspan>")
  }
  [void]$svg.AppendLine('</text>')
}
Add-Text @('Коротко о лагере') 284 136 50 60 '#233B59' 600
Add-Text @('Уютная контролируемая территория, насыщенная программа и понятные правила —','чтобы детям было весело, а родителям спокойно') 284 184 23 32
Add-Text @('Лагерь работает официально: документы, сведения об организаторе и реестре') 284 266 23 32
Add-Text @('доступны в разделе') 284 298 23 32
Add-Text @('«Сведения об организации отдыха детей» →') 513 298 23 32 '#111111' 700
$cards = @(
 @{image='assets/images/misc/leisure-main.jpg'; title=@('Организованный досуг'); body=@('Каждый день — расписание','с балансом активности и','отдыха, без перегруза.','Внимательные воспитатели','и задорные вожатые')},
 @{image='assets/images/programs/program-creativity.jpg'; title=@('Творчество и развитие'); body=@('Сцена, творческие','мастерские, игры и квесты','помогают ребёнку','открывать в себе новые','таланты')},
 @{image='assets/images/misc/security-camera.jpg'; title=@('Безопасность и комфорт'); body=@('Контроль территории,','медицинское','сопровождение, простые','правила, внимательное и','ответственное отношение','педагогов помогают','родителям понимать, как','организован отдых и кто','отвечает за детей в течение','смены')},
 @{image='assets/images/misc/dining-room.jpg'; title=@('Сбалансированное','питание и комфортное','проживание'); body=@('Продуманное меню с','элементами шведского','стола, режим, проживание в','уютных обновленных','номерах. Особенности','здоровья ребенка','обсуждаются заранее и','учитываются в пределах','возможностей лагеря и','медицинских рекомендаций')}
)
for($i=0; $i -lt $cards.Count; $i++) {
  $x=284+$i*390; $inside=$x+22
  [void]$svg.AppendLine("<g id='card-$i'><rect x='$x' y='336' width='370' height='694' rx='13' fill='white' stroke='#DEDEDE' filter='url(#shadow)'/>")
  [void]$svg.AppendLine("<defs><clipPath id='photo-$i'><rect x='$inside' y='358' width='326' height='200' rx='12'/></clipPath></defs>")
  $bytes=[IO.File]::ReadAllBytes((Join-Path $root $cards[$i].image))
  $b64=[Convert]::ToBase64String($bytes)
  [void]$svg.AppendLine("<image x='$inside' y='358' width='326' height='200' preserveAspectRatio='xMidYMid slice' clip-path='url(#photo-$i)' xlink:href='data:image/jpeg;base64,$b64'/>")
  Add-Text $cards[$i].title $inside 597 25 29 '#233B59' 600
  $bodyY=640+($cards[$i].title.Count-1)*29
  Add-Text $cards[$i].body $inside $bodyY 23 32
  [void]$svg.AppendLine('</g>')
}
[void]$svg.AppendLine('</svg>')
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'slide-04-about.svg'),$svg.ToString(),[Text.UTF8Encoding]::new($false))
[xml]$check = $svg.ToString()
Write-Output 'Created slide-04-about.svg: 1920 x 1080; 4 embedded photos; editable text.'
