param(
    [Parameter(Mandatory=$true)]
    [string]$SourcePath,
    
    [Parameter(Mandatory=$true)]
    [string]$DestinationPath
)

# Create destination directory if it doesn't exist
if (-not (Test-Path -Path $DestinationPath)) {
    New-Item -ItemType Directory -Path $DestinationPath | Out-Null
    Write-Host "Created destination directory: $DestinationPath"
} else {
    Write-Host "Deleting files at: $DestinationPath"
    Remove-Item $DestinationPath\* -Force -Recurse
}

# Predefined exclusion patterns
$excludePatterns = @(
    "^.*\\node_modules\\.*",   # Exclude node_modules folder
    "^.*\\build\\.*",          # Exclude build folder
    "^.*\\package-lock.json$", # Exclude package-lock.json file
    "^.*\\copyfiles.ps1$",     # This file
    "^.*\\dirTree.ps1$",
    "^.*.png"
)

# Get all files recursively, excluding specified patterns
$files = Get-ChildItem -Path $SourcePath -File -Recurse | Where-Object {
    $fullPath = $_.FullName
    $exclude = $false
    
    foreach ($pattern in $excludePatterns) {
        if ($fullPath -match $pattern) {
            $exclude = $true
            break
        }
    }
    
    -not $exclude
}

# Counter for progress tracking
$totalFiles = $files.Count
$currentFile = 0

foreach ($file in $files) {
    $currentFile++
    $fileName = $file.Name
    $newPath = Join-Path -Path $DestinationPath -ChildPath $fileName
    
    # Handle duplicate file names by adding a counter
    $counter = 1
    while (Test-Path -Path $newPath) {
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) + 
                   "_$counter" + 
                   [System.IO.Path]::GetExtension($file.Name)
        $newPath = Join-Path -Path $DestinationPath -ChildPath $fileName
        $counter++
    }
    
    # Copy the file
    Copy-Item -Path $file.FullName -Destination $newPath
    
    # Display progress
    $percentComplete = [math]::Round(($currentFile / $totalFiles) * 100, 2)
    Write-Progress -Activity "Copying Files" -Status "$percentComplete% Complete" -PercentComplete $percentComplete
    Write-Host "Copied: $($file.FullName) -> $newPath"
}

Write-Host "`nCopy operation completed successfully!"
Write-Host "Total files copied: $totalFiles"
Write-Host "Destination directory: $DestinationPath"