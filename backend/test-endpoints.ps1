$backendDir = "D:\e-commerce_ppweb\backend"
Set-Location $backendDir

# Build first
npm run build

# Start server in background
$proc = Start-Process node -ArgumentList "dist/main.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 3

try {
    Write-Host "================= 1. GET ALL PRODUCTS ================="
    $res1 = Invoke-RestMethod -Uri "http://localhost:3000/products" -Method Get
    Write-Host "Count: $($res1.Count) products"
    $res1 | Select-Object -First 2 | ConvertTo-Json

    Write-Host "`n================= 2. GET PRODUCT BY ID (1) ================="
    $res2 = Invoke-RestMethod -Uri "http://localhost:3000/products/1" -Method Get
    $res2 | ConvertTo-Json

    Write-Host "`n================= 3. GET PRODUCT BY ID (999) - NOT FOUND ================="
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/products/999" -Method Get
    } catch {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $_.ErrorDetails.Message
    }

    Write-Host "`n================= 4. POST CREATE PRODUCT (SUCCESS) ================="
    $newProduct = @{
        name = "Hoodie Minimalist Hitam"
        price = 259000
        category = "Pakaian"
        stock = 35
        description = "Hoodie katun fleece hangat dengan potongan relaxed fit dan kantong kangaroo."
        isAvailable = $true
        image = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
    } | ConvertTo-Json
    $res4 = Invoke-RestMethod -Uri "http://localhost:3000/products" -Method Post -Body $newProduct -ContentType "application/json"
    $res4 | ConvertTo-Json

    Write-Host "`n================= 5. POST CREATE PRODUCT (CONFLICT) ================="
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/products" -Method Post -Body $newProduct -ContentType "application/json"
    } catch {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $_.ErrorDetails.Message
    }

    Write-Host "`n================= 6. POST CREATE PRODUCT (VALIDATION ERROR) ================="
    $invalidProduct = @{
        name = ""
        price = 500
        category = "Makanan"
        stock = -5
    } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/products" -Method Post -Body $invalidProduct -ContentType "application/json"
    } catch {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $_.ErrorDetails.Message
    }

    Write-Host "`n================= 7. PATCH UPDATE PRODUCT (ID: 1) ================="
    $updateData = @{
        price = 139000
        stock = 40
        description = "Kaos oversize berbahan katun combed premium 24s - Edisi Spesial Diskon!"
    } | ConvertTo-Json
    $res7 = Invoke-RestMethod -Uri "http://localhost:3000/products/1" -Method Patch -Body $updateData -ContentType "application/json"
    $res7 | ConvertTo-Json

    Write-Host "`n================= 8. PATCH UPDATE PRODUCT (ID: 999) - NOT FOUND ================="
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/products/999" -Method Patch -Body $updateData -ContentType "application/json"
    } catch {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $_.ErrorDetails.Message
    }

    Write-Host "`n================= 9. DELETE PRODUCT (ID: 2) ================="
    $res9 = Invoke-RestMethod -Uri "http://localhost:3000/products/2" -Method Delete
    $res9 | ConvertTo-Json

    Write-Host "`n================= 10. DELETE PRODUCT (ID: 999) - NOT FOUND ================="
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/products/999" -Method Delete
    } catch {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $_.ErrorDetails.Message
    }
} finally {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}

