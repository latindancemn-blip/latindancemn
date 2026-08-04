$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
try {
    $listener.Start()
    Write-Output "--------------------------------------------------------"
    Write-Output "AURORA DO SAMBA - LOCAL PRESENTATION SERVER STARTED"
    Write-Output "Open your browser and navigate to: http://localhost:8000/"
    Write-Output "--------------------------------------------------------"
    Write-Output "To stop the server, press Ctrl+C or kill the task."
} catch {
    Write-Error "Failed to start listener: $_"
    exit
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        if ($url -eq "/") { $url = "index.html" }
        
        # Clean URL to prevent directory traversal
        $url = $url.Replace("..", "")
        # Remove leading slash so Join-Path treats it as a relative child path
        if ($url.StartsWith("/")) {
            $url = $url.Substring(1)
        }
        
        $path = Join-Path (Get-Location) $url
        
        if (Test-Path $path -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($path)
            $response.ContentLength64 = $bytes.Length
            
            # Content-Type
            if ($path -like "*.html") { $response.ContentType = "text/html" }
            elseif ($path -like "*.css") { $response.ContentType = "text/css" }
            elseif ($path -like "*.js") { $response.ContentType = "application/javascript" }
            elseif ($path -like "*.png") { $response.ContentType = "image/png" }
            elseif ($path -like "*.jpg" -or $path -like "*.jpeg") { $response.ContentType = "image/jpeg" }
            elseif ($path -like "*.mp4") { $response.ContentType = "video/mp4" }
            elseif ($path -like "*.m4a") { $response.ContentType = "audio/mp4" }
            elseif ($path -like "*.mp3") { $response.ContentType = "audio/mpeg" }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Output "Served 200: /$url"
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $url")
            $response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Output "Served 404: /$url"
        }
        $response.Close()
    } catch {
        Write-Output "Error handling request: $_"
        try {
            if ($response) { $response.Close() }
        } catch {}
    }
}
$listener.Stop()
