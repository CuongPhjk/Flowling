$ErrorActionPreference = 'Stop'
$manifest = Get-Content -LiteralPath 'public/media/manifest.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$timings = @{}
foreach ($item in $manifest) {
    $files = @()
    $lengths = @()
    for ($i = 0; $i -lt $item.paragraphs.Count; $i++) {
        $part = Join-Path (Get-Location) "public/media/$($item.id)-$i.wav"
        $voice = New-Object -ComObject SAPI.SpVoice
        $voices = $voice.GetVoices()
        for ($voiceIndex=0; $voiceIndex -lt $voices.Count; $voiceIndex++) {
            if ($voices.Item($voiceIndex).GetDescription() -match 'English|David|Zira') { $voice.Voice = $voices.Item($voiceIndex); break }
        }
        $stream = New-Object -ComObject SAPI.SpFileStream
        $stream.Open($part, 3)
        $voice.AudioOutputStream = $stream
        $voice.Rate = -1
        [void]$voice.Speak($item.paragraphs[$i].en)
        $stream.Close()
        $seconds = & ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $part
        $lengths += [int][Math]::Round([double]::Parse($seconds, [Globalization.CultureInfo]::InvariantCulture) * 1000)
        $files += "file '$($item.id)-$i.wav'"
    }
    $timings[$item.id] = $lengths
    $listPath = "public/media/$($item.id)-concat.txt"
    Set-Content -LiteralPath $listPath -Value $files -Encoding ASCII
    & ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i $listPath -c:a pcm_s16le "public/media/$($item.id).wav"
    if ($LASTEXITCODE -ne 0) { throw 'Audio merge failed' }
    if ($item.type -eq 'VIDEO') {
        & ffmpeg -hide_banner -loglevel error -y -f lavfi -i 'color=c=0x163e32:s=960x540:r=15' -i "public/media/$($item.id).wav" -vf "drawbox=x=60:y=60:w=840:h=420:color=0x4e7962:t=2,drawtext=fontfile='C\:/Windows/Fonts/segoeui.ttf':text='Flowling Originals':fontsize=42:fontcolor=white:x=80:y=150,drawtext=fontfile='C\:/Windows/Fonts/segoeui.ttf':text='A moment of discovery':fontsize=24:fontcolor=0xc1d9c8:x=80:y=220,drawbox=x=80:y=360:w=800:h=4:color=0x729a7d:t=fill" -c:v libx264 -preset ultrafast -crf 30 -c:a aac -shortest -movflags +faststart "public/media/$($item.id).mp4"
        if ($LASTEXITCODE -ne 0) { throw 'Video generation failed' }
        Remove-Item -LiteralPath "public/media/$($item.id).wav"
    }
    for ($i=0; $i -lt $item.paragraphs.Count; $i++) { Remove-Item -LiteralPath "public/media/$($item.id)-$i.wav" }
    Remove-Item -LiteralPath $listPath
}
$timings | ConvertTo-Json | Set-Content -LiteralPath 'src/shared/mock/media-timing.json' -Encoding UTF8
Write-Output 'Generated local narrated media and exact transcript durations.'
