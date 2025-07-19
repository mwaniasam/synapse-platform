# List of API routes to mock
$apiRoutes = @(
    "ai-assist",
    "analytics",
    "auth/[...nextauth]",
    "cognitve-state",
    "debug/env",
    "env-test",
    "preferences",
    "sessions",
    "sessions/[id]"
)

# Path to the mock route template
$mockTemplatePath = "$PWD\mock-route.ts"

# Base API path
$apiPath = "$PWD\src\app\api"

# Read the template content
$template = Get-Content -Path $mockTemplatePath -Raw

foreach ($route in $apiRoutes) {
    $routeDir = Join-Path -Path $apiPath -ChildPath (Split-Path -Path $route -Parent)
    $routeFile = Join-Path -Path $apiPath -ChildPath "$route\route.ts"
    
    # Create directory if it doesn't exist
    if (-not (Test-Path -Path $routeDir)) {
        New-Item -ItemType Directory -Path $routeDir -Force | Out-Null
    }
    
    # Update the path in the template
    $routeTemplate = $template -replace "/api/route", "/api/$route"
    
    # Write the route file
    $routeTemplate | Out-File -FilePath $routeFile -Force -Encoding utf8
    Write-Host "✅ Created/Updated mock route: $routeFile"
}

Write-Host "`n🎉 All API routes have been mocked successfully!" -ForegroundColor Green
