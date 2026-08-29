$lines = Get-Content 'c:\gustav-dev-portfolio\app\components\TerminalOutput.tsx'
$kept = $lines[0..171]
$removed = $lines[205..($lines.Length-1)]
$result = $kept + $removed
$result | Set-Content 'c:\gustav-dev-portfolio\app\components\TerminalOutput.tsx'