# Deploys the frontend: builds, uploads to S3, and invalidates CloudFront's
# cache so changes appear immediately instead of waiting for cache expiry.
#
# Usage: run this from the client/ folder
#   .\deploy-frontend.ps1

Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed - stopping before touching AWS." -ForegroundColor Red
    exit 1
}

Write-Host "Uploading to S3..." -ForegroundColor Cyan
aws s3 sync dist/ s3://nithishnarravula-resume-site --delete

Write-Host "Invalidating CloudFront cache..." -ForegroundColor Cyan
aws cloudfront create-invalidation --distribution-id E56AKHQOEY2IU --paths "/*"

Write-Host "Done. Changes should be live at https://nithishnarravula.dev within a minute or two." -ForegroundColor Green
