$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$pptx = Join-Path $base "workmate-app-demo-vertical.pptx"
$mp4 = Join-Path $base "workmate-app-demo-vertical.mp4"

if (Test-Path $pptx) { Remove-Item -LiteralPath $pptx -Force }
if (Test-Path $mp4) { Remove-Item -LiteralPath $mp4 -Force }

$ppLayoutBlank = 12
$msoShapeRoundedRectangle = 5
$msoShapeRectangle = 1
$msoFalse = 0
$msoTrue = -1

$bg = [int]0xE8F0F5
$cream = [int]0xF4F8FA
$brown = [int]0x0A131E
$muted = [int]0x48627A
$accent = [int]0x1A4F9B
$amber = [int]0x2A69C2
$green = [int]0x4A6B3D
$red = [int]0x3030B8
$white = [int]0xFFFFFF

function Add-Text($slide, [string]$text, [double]$x, [double]$y, [double]$w, [double]$h, [double]$size, [int]$color, [bool]$bold = $true) {
  $shape = $slide.Shapes.AddTextbox(1, $x, $y, $w, $h)
  $shape.TextFrame.TextRange.Text = $text
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  $shape.TextFrame.WordWrap = $msoTrue
  $shape.TextFrame.TextRange.Font.Name = "Arial"
  $shape.TextFrame.TextRange.Font.Size = $size
  $shape.TextFrame.TextRange.Font.Color.RGB = $color
  if ($bold) { $shape.TextFrame.TextRange.Font.Bold = $msoTrue }
  return $shape
}

function Add-Box($slide, [double]$x, [double]$y, [double]$w, [double]$h, [int]$fill, [double]$radius = 0.18) {
  $shape = $slide.Shapes.AddShape($msoShapeRoundedRectangle, $x, $y, $w, $h)
  $shape.Fill.ForeColor.RGB = $fill
  $shape.Line.ForeColor.RGB = [int]0x557DA0
  $shape.Line.Transparency = 0.72
  $shape.Adjustments.Item(1) = $radius
  return $shape
}

function Add-Pill($slide, [string]$text, [double]$x, [double]$y, [double]$w, [double]$h) {
  $shape = Add-Box $slide $x $y $w $h ([int]0xE8EEF7) 0.5
  $shape.Line.ForeColor.RGB = [int]0xD5BFA0
  $shape.Line.Transparency = 0.35
  Add-Text $slide $text ($x + 9) ($y + 5) ($w - 18) ($h - 8) 10 $accent $true | Out-Null
}

function Add-Phone($slide) {
  $phone = Add-Box $slide 67 175 406 690 ([int]0x0D1014) 0.18
  $phone.Line.Transparency = 0.35
  $screen = Add-Box $slide 79 187 382 666 $bg 0.13
  $screen.Line.Transparency = 1
  $notch = Add-Box $slide 208 197 124 20 ([int]0x0D1014) 0.5
  $notch.Line.Transparency = 1
  return @{ X = 79; Y = 187; W = 382; H = 666 }
}

function Add-Nav($slide) {
  Add-Box $slide 102 792 336 46 ([int]0xF4F8FA) 0.5 | Out-Null
  Add-Text $slide "Home      Jobs      Staff      DM      Profile" 125 806 285 18 10 $muted $true | Out-Null
}

function Add-Job($slide, [string]$icon, [string]$title, [string]$meta, [double]$y, [string[]]$tags) {
  Add-Box $slide 104 $y 332 74 $cream 0.16 | Out-Null
  $pic = Add-Box $slide 116 ($y + 11) 52 52 $accent 0.16
  $pic.Line.Transparency = 1
  Add-Text $slide $icon 129 ($y + 23) 28 24 20 $white $true | Out-Null
  Add-Text $slide $title 180 ($y + 12) 216 18 15 $brown $true | Out-Null
  Add-Text $slide $meta 180 ($y + 32) 230 15 9.5 $muted $false | Out-Null
  $tx = 180
  foreach ($tag in $tags) {
    Add-Pill $slide $tag $tx ($y + 51) 82 17
    $tx += 88
  }
}

function Add-Staff($slide, [string]$initial, [string]$name, [string]$meta, [double]$y, [string[]]$tags) {
  Add-Box $slide 104 $y 332 70 $cream 0.16 | Out-Null
  $av = $slide.Shapes.AddShape(9, 116, ($y + 12), 46, 46)
  $av.Fill.ForeColor.RGB = $accent
  $av.Line.Transparency = 1
  Add-Text $slide $initial 131 ($y + 23) 20 18 16 $white $true | Out-Null
  Add-Text $slide $name 174 ($y + 11) 170 17 14 $brown $true | Out-Null
  Add-Text $slide $meta 174 ($y + 30) 190 13 9.5 $muted $false | Out-Null
  Add-Pill $slide $tags[0] 174 ($y + 48) 62 16
  Add-Pill $slide $tags[1] 241 ($y + 48) 95 16
  $btn = Add-Box $slide 377 ($y + 24) 42 24 $accent 0.22
  $btn.Line.Transparency = 1
  Add-Text $slide "DM" 388 ($y + 30) 18 12 9 $white $true | Out-Null
}

function Add-Header($slide, [string]$headline, [string]$sub) {
  Add-Text $slide "WorkMate Australia" 34 34 220 25 16 $accent $true | Out-Null
  Add-Text $slide $headline 34 66 472 82 33 $brown $true | Out-Null
  Add-Text $slide $sub 34 144 440 34 15 $muted $true | Out-Null
}

$powerPoint = New-Object -ComObject PowerPoint.Application
$powerPoint.Visible = $msoTrue
$presentation = $powerPoint.Presentations.Add($msoTrue)
$presentation.PageSetup.SlideWidth = 540
$presentation.PageSetup.SlideHeight = 960

# Slide 1: Home activity
$slide = $presentation.Slides.Add(1, $ppLayoutBlank)
$slide.FollowMasterBackground = $msoFalse
$slide.Background.Fill.ForeColor.RGB = $bg
Add-Header $slide "When the app is active..." "Employers see real activity, not empty listings."
$p = Add-Phone $slide
Add-Box $slide 79 187 382 148 ([int]0xCCE0ED) 0.08 | Out-Null
Add-Text $slide "Good day" 104 232 120 18 11 $muted $false | Out-Null
Add-Text $slide "WorkMate Australia" 104 252 260 28 22 $brown $true | Out-Null
Add-Text $slide "Hospitality jobs and staff in Sydney" 104 282 260 18 11 $muted $true | Out-Null
$sx = 104
@(("128","staff profiles"),("42","open jobs"),("310","messages")) | ForEach-Object {
  Add-Box $slide $sx 310 96 54 $cream 0.16 | Out-Null
  Add-Text $slide $_[0] ($sx + 10) 320 76 20 20 $accent $true | Out-Null
  Add-Text $slide $_[1] ($sx + 10) 344 78 12 8.5 $muted $true | Out-Null
  $script:sx += 110
}
Add-Text $slide "Today's activity" 104 382 260 24 18 $brown $true | Out-Null
Add-Job $slide "C" "Barista shifts matched" "12 candidates available this week" 420 @("Cafe","Part-time")
Add-Job $slide "K" "Kitchen hand applicants" "7 new applications since morning" 506 @("Dinner","CBD")
Add-Nav $slide

# Slide 2: Jobs feed
$slide = $presentation.Slides.Add(2, $ppLayoutBlank)
$slide.FollowMasterBackground = $msoFalse
$slide.Background.Fill.ForeColor.RGB = $bg
Add-Header $slide "Jobs fill the feed." "Cafes, restaurants, and bars can post roles in minutes."
Add-Phone $slide | Out-Null
Add-Text $slide "Find Jobs" 104 238 200 30 24 $brown $true | Out-Null
Add-Box $slide 104 282 332 34 $white 0.14 | Out-Null
Add-Text $slide "Search cafe, barista, kitchen..." 118 292 230 12 10 $muted $true | Out-Null
Add-Text $slide "Hiring now" 104 336 180 22 17 $brown $true | Out-Null
Add-Job $slide "C" "Morning Barista" "Harbour Cafe / Circular Quay / $30 hr" 374 @("Basic English OK","Part-time")
Add-Job $slide "S" "Sushi Roll Maker" "Sakura Kitchen / CBD / $29 hr" 459 @("No English","Dinner")
Add-Job $slide "B" "Bartender" "George St Bar / CBD / $32 hr" 544 @("Weekend","Trial shift")
Add-Nav $slide

# Slide 3: Staff profiles
$slide = $presentation.Slides.Add(3, $ppLayoutBlank)
$slide.FollowMasterBackground = $msoFalse
$slide.Background.Fill.ForeColor.RGB = $bg
Add-Header $slide "Staff profiles are ready." "WHV holders and students show availability, skills, and visa details."
Add-Phone $slide | Out-Null
Add-Text $slide "Find Staff" 104 238 200 30 24 $brown $true | Out-Null
Add-Text $slide "Available candidates in Sydney" 104 270 240 16 10.5 $muted $true | Out-Null
Add-Staff $slide "M" "Mika Tanaka" "Japan / Barista / Mon-Fri" 318 @("WHV","Basic English OK")
Add-Staff $slide "J" "Jiho Park" "Korea / Kitchen hand / Nights" 400 @("Student","Dinner shifts")
Add-Staff $slide "A" "Alex Kim" "WHV / Floor staff / Weekend" 482 @("Cafe","Restaurant")
Add-Nav $slide

# Slide 4: DM
$slide = $presentation.Slides.Add(4, $ppLayoutBlank)
$slide.FollowMasterBackground = $msoFalse
$slide.Background.Fill.ForeColor.RGB = $bg
Add-Header $slide "Hiring moves to DM." "No agency. No waiting. Just direct conversation."
Add-Phone $slide | Out-Null
Add-Text $slide "Messages" 104 238 200 30 24 $brown $true | Out-Null
Add-Staff $slide "S" "Sakura Kitchen" "Trial shift available this Thursday?" 286 @("2 new","Kitchen")
Add-Box $slide 112 388 250 54 $white 0.18 | Out-Null
Add-Text $slide "Hi Mika, are you available for a trial shift this week?" 126 402 220 24 11 $brown $false | Out-Null
Add-Box $slide 178 455 232 54 $accent 0.18 | Out-Null
Add-Text $slide "Yes, Wednesday or Thursday works for me." 192 470 200 22 11 $white $false | Out-Null
Add-Box $slide 112 522 250 54 $white 0.18 | Out-Null
Add-Text $slide "Great. Let's confirm Thursday 10am." 126 538 220 20 11 $brown $false | Out-Null
Add-Nav $slide

# Slide 5: Employer dashboard
$slide = $presentation.Slides.Add(5, $ppLayoutBlank)
$slide.FollowMasterBackground = $msoFalse
$slide.Background.Fill.ForeColor.RGB = $bg
Add-Header $slide "WorkMate Australia" "Start hiring for free in Sydney hospitality."
Add-Phone $slide | Out-Null
Add-Text $slide "My Listings" 104 238 200 30 24 $brown $true | Out-Null
Add-Box $slide 104 286 332 78 $cream 0.16 | Out-Null
Add-Text $slide "Kitchen staff wanted" 120 302 220 18 15 $brown $true | Out-Null
Add-Text $slide "Sakura Kitchen / Sydney CBD / $29 hr" 120 326 230 14 10 $muted $false | Out-Null
Add-Pill $slide "14 applications" 120 344 90 17
Add-Pill $slide "Hiring" 216 344 55 17
Add-Text $slide "New applicants" 104 386 180 22 17 $brown $true | Out-Null
Add-Staff $slide "J" "Jiho Park" "Kitchen hand experience. Available weeknights." 424 @("Student","Ready now")
Add-Staff $slide "Y" "Yui Sato" "Japanese restaurant experience. WHV holder." 506 @("WHV","CBD")
$cta = Add-Box $slide 104 628 332 64 $accent 0.18
$cta.Line.Transparency = 1
Add-Text $slide "Start hiring for free" 135 646 260 26 20 $white $true | Out-Null
Add-Text $slide "workmate-three.vercel.app" 150 676 240 16 10.5 $white $true | Out-Null
Add-Nav $slide

foreach ($s in $presentation.Slides) {
  $s.SlideShowTransition.AdvanceOnTime = $msoTrue
  $s.SlideShowTransition.AdvanceTime = 3
  $s.SlideShowTransition.EntryEffect = 1793
}

$presentation.SaveAs($pptx)
$presentation.CreateVideo($mp4, $msoTrue, 3, 1080, 30, 85)

$deadline = (Get-Date).AddMinutes(5)
do {
  Start-Sleep -Seconds 3
  $status = $presentation.CreateVideoStatus
  $exists = Test-Path $mp4
} while (($status -eq 1 -or -not $exists) -and (Get-Date) -lt $deadline)

$presentation.Close()
$powerPoint.Quit()

[System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null

if (-not (Test-Path $mp4)) {
  throw "MP4 export did not complete: $mp4"
}

Get-Item $pptx, $mp4 | Select-Object FullName, Length, LastWriteTime
