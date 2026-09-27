Add-Type -AssemblyName System.Drawing

function Get-F($fam, $sz, $sty) {
    if ($null -eq $sty) {
        return [System.Drawing.Font]::new($fam, [single]$sz, [System.Drawing.FontStyle]::Regular)
    }
    return [System.Drawing.Font]::new($fam, [single]$sz, $sty)
}

function Create-Barcode($g, $x, $y, $w, $h, $seed) {
    $rand = New-Object System.Random($seed)
    $curX = $x
    while ($curX -lt ($x + $w)) {
        $barW = $rand.Next(2, 5)
        $isBlack = ($rand.Next(0, 10) -gt 3)
        if ($isBlack) {
            $g.FillRectangle([System.Drawing.Brushes]::Black, $curX, $y, $barW, $h)
        }
        $curX += $barW + $rand.Next(1, 4)
    }
}

function Create-QrPattern($g, $x, $y, $size) {
    $g.FillRectangle([System.Drawing.Brushes]::White, $x, $y, $size, $size)
    $g.DrawRectangle([System.Drawing.Pens]::Black, $x, $y, $size, $size)
    $cellSize = [math]::Floor($size / 21)
    
    $drawFinder = {
        param($fx, $fy)
        $g.FillRectangle([System.Drawing.Brushes]::Black, $fx, $fy, (7 * $cellSize), (7 * $cellSize))
        $g.FillRectangle([System.Drawing.Brushes]::White, ($fx + $cellSize), ($fy + $cellSize), (5 * $cellSize), (5 * $cellSize))
        $g.FillRectangle([System.Drawing.Brushes]::Black, ($fx + (2 * $cellSize)), ($fy + (2 * $cellSize)), (3 * $cellSize), (3 * $cellSize))
    }
    & $drawFinder $x $y
    & $drawFinder ($x + $size - (7 * $cellSize)) $y
    & $drawFinder $x ($y + $size - (7 * $cellSize))
    
    $rand = New-Object System.Random(1337)
    for ($r = 0; $r -lt 21; $r++) {
        for ($c = 0; $c -lt 21; $c++) {
            if (($r -lt 8 -and $c -lt 8) -or ($r -lt 8 -and $c -gt 13) -or ($r -gt 13 -and $c -lt 8)) { continue }
            if ($rand.Next(0, 2) -eq 1) {
                $g.FillRectangle([System.Drawing.Brushes]::Black, ($x + ($c * $cellSize)), ($y + ($r * $cellSize)), $cellSize, $cellSize)
            }
        }
    }
}

$bBold = [System.Drawing.FontStyle]::Bold
$bItalic = [System.Drawing.FontStyle]::Italic
$bRegular = [System.Drawing.FontStyle]::Regular

$sfCenter = New-Object System.Drawing.StringFormat
$sfCenter.Alignment = [System.Drawing.StringAlignment]::Center

# ==============================================================================
# 1. GENERATE BIRTH CERTIFICATE (FORM NO. 5)
# ==============================================================================
Write-Host "Rendering Document 1: Official Birth Certificate..."
$w = 1200
$h = 1650
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$g.Clear([System.Drawing.Color]::FromArgb(254, 254, 250))

$borderPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(44, 122, 70), 5)
$borderPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 140, 60), 2)
$g.DrawRectangle($borderPen1, 35, 35, ($w - 70), ($h - 70))
$g.DrawRectangle($borderPen2, 45, 45, ($w - 90), ($h - 90))

# Watermark
$wmFont = Get-F "Georgia" 50 $bBold
$wmBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 44, 122, 70))
$g.DrawString("GOVERNMENT OF GUJARAT", $wmFont, $wmBrush, 130, 750)
$g.DrawString("GONDAL NAGARPALIKA", $wmFont, $wmBrush, 190, 850)

# Fonts
$fGov = Get-F "Georgia" 22 $bBold
$fSubGov = Get-F "Arial" 13 $bBold
$fForm = Get-F "Arial" 15 $bBold
$fTitle = Get-F "Georgia" 28 $bBold
$fLaw = Get-F "Arial" 10 $bRegular
$fBody = Get-F "Georgia" 11 $bItalic
$fLabel = Get-F "Arial" 11 $bBold
$fVal = Get-F "Arial" 12 $bBold
$fValNorm = Get-F "Arial" 11 $bRegular

$cDarkGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 80, 45))
$cDarkSlate = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
$cDarkNavy = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))

$g.DrawString("GOVERNMENT OF GUJARAT", $fGov, $cDarkGreen, ($w / 2), 65, $sfCenter)
$g.DrawString("DEPARTMENT OF HEALTH AND FAMILY WELFARE", $fSubGov, $cDarkSlate, ($w / 2), 105, $sfCenter)
$g.DrawString("GONDAL NAGARPALIKA (DISTRICT: RAJKOT)", $fSubGov, $cDarkGreen, ($w / 2), 130, $sfCenter)

$g.DrawLine($borderPen2, 100, 160, ($w - 100), 160)

$g.DrawString("FORM NO. 5", $fForm, $cDarkSlate, ($w / 2), 175, $sfCenter)
$g.DrawString("BIRTH CERTIFICATE", $fTitle, $cDarkNavy, ($w / 2), 205, $sfCenter)
$g.DrawString("(ISSUED UNDER SECTION 12/17 OF REGISTRATION OF BIRTHS AND DEATHS ACT, 1969)", $fLaw, [System.Drawing.Brushes]::Gray, ($w / 2), 255, $sfCenter)
$g.DrawString("AND RULE 8/13 OF GUJARAT REGISTRATION OF BIRTHS AND DEATHS RULES, 2004", $fLaw, [System.Drawing.Brushes]::Gray, ($w / 2), 273, $sfCenter)

$introRect = New-Object System.Drawing.RectangleF 90, 310, ($w - 180), 70
$introText = "This is to certify that the following information has been taken from the original record of birth which is the register for Gondal Nagarpalika of Taluka Gondal, District Rajkot of State Gujarat, India."
$g.DrawString($introText, $fBody, $cDarkSlate, $introRect)

$tableY = 385
$rowH = 50
$rows = @(
    @("1. Full Name of Child", "KHUNT HARKISHAN VINODRAI"),
    @("2. Sex (Gender)", "MALE (M)"),
    @("3. Date of Birth", "15/10/2003 (FIFTEENTH OCTOBER TWO THOUSAND THREE)"),
    @("4. Place of Birth", "GOVERNMENT SUB-DISTRICT HOSPITAL, GONDAL, RAJKOT"),
    @("5. Name of Father", "KHUNT VINODRAI NARANBHAI"),
    @("6. Name of Mother", "KHUNT SHARDABEN VINODRAI"),
    @("7. Address of Parents at Child's Birth", "PATEL STREET, NEAR S.T. BUS STATION, GONDAL - 360311"),
    @("8. Permanent Address of Parents", "PATEL STREET, NEAR S.T. BUS STATION, GONDAL - 360311"),
    @("9. Registration Number", "B-2003-GJ-0482910"),
    @("10. Date of Registration", "22/10/2003"),
    @("11. Date of Issue of Certificate", "25/10/2003")
)

$tblX = 85
$tblW = $w - 170
$col1W = 380
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 215, 220), 1.5)
$gridHeaderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 248, 242))

for ($i = 0; $i -lt $rows.Length; $i++) {
    $curY = $tableY + ($i * $rowH)
    if ($i % 2 -eq 0) {
        $g.FillRectangle($gridHeaderBrush, $tblX, $curY, $tblW, $rowH)
    } else {
        $g.FillRectangle([System.Drawing.Brushes]::White, $tblX, $curY, $tblW, $rowH)
    }
    
    $g.DrawRectangle($gridPen, $tblX, $curY, $tblW, $rowH)
    $g.DrawLine($gridPen, ($tblX + $col1W), $curY, ($tblX + $col1W), ($curY + $rowH))
    
    $g.DrawString($rows[$i][0], $fLabel, $cDarkSlate, ($tblX + 15), ($curY + 14))
    
    if ($i -eq 0 -or $i -eq 2 -or $i -eq 4 -or $i -eq 8) {
        $g.DrawString($rows[$i][1], $fVal, [System.Drawing.Brushes]::Black, ($tblX + $col1W + 15), ($curY + 13))
    } else {
        $g.DrawString($rows[$i][1], $fValNorm, $cDarkSlate, ($tblX + $col1W + 15), ($curY + 14))
    }
}

$footerY = $tableY + ($rows.Length * $rowH) + 35

$g.DrawString("DOCUMENT VERIFICATION CODE: GJ-BTH-2003-482910", $fLaw, [System.Drawing.Brushes]::Gray, 85, $footerY)
Create-Barcode $g 85 ($footerY + 22) 280 40 4829
$g.DrawString("* B - 2 0 0 3 - G J - 0 4 8 2 9 1 0 *", $fLaw, [System.Drawing.Brushes]::Black, 110, ($footerY + 68))

Create-QrPattern $g 420 ($footerY + 10) 95

$stampPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 90, 40, 160), 3)
$stampPenInner = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 90, 40, 160), 1.5)
$stampBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 90, 40, 160))
$stampX = 640
$stampY = $footerY - 15
$g.DrawEllipse($stampPen, $stampX, $stampY, 130, 130)
$g.DrawEllipse($stampPenInner, ($stampX + 8), ($stampY + 8), 114, 114)
$fStamp = Get-F "Arial" 8.5 $bBold
$fStampCenter = Get-F "Georgia" 11 $bBold
$g.DrawString("REGISTRAR", $fStamp, $stampBrush, ($stampX + 65), ($stampY + 22), $sfCenter)
$g.DrawString("BIRTHS & DEATHS", $fStampCenter, $stampBrush, ($stampX + 65), ($stampY + 45), $sfCenter)
$g.DrawString("GONDAL NAGARPALIKA", $fStamp, $stampBrush, ($stampX + 65), ($stampY + 70), $sfCenter)
$g.DrawString("RAJKOT GUJARAT", $fStamp, $stampBrush, ($stampX + 65), ($stampY + 92), $sfCenter)

$signX = 850
$g.DrawString("CERTIFIED AUTHENTIC BY:", $fLaw, [System.Drawing.Brushes]::Gray, $signX, $footerY)
$signPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 30, 120), 2)
$g.DrawBezier($signPen, ($signX + 10), ($footerY + 45), ($signX + 40), ($footerY + 15), ($signX + 80), ($footerY + 60), ($signX + 140), ($footerY + 30))
$g.DrawBezier($signPen, ($signX + 120), ($footerY + 35), ($signX + 150), ($footerY + 15), ($signX + 190), ($footerY + 55), ($signX + 220), ($footerY + 40))
$g.DrawLine($signPen, ($signX + 15), ($footerY + 58), ($signX + 210), ($footerY + 58))

$fSignTitle = Get-F "Arial" 11 $bBold
$fSignSub = Get-F "Arial" 9.5 $bRegular
$g.DrawString("Sub-Registrar (Birth & Death)", $fSignTitle, $cDarkNavy, $signX, ($footerY + 68))
$g.DrawString("Gondal Nagarpalika, Dist. Rajkot", $fSignSub, $cDarkSlate, $signX, ($footerY + 86))
$g.DrawString("Government of Gujarat", $fSignSub, $cDarkSlate, $signX, ($footerY + 102))

$fStatutory = Get-F "Arial" 8.5 $bRegular
$statutoryText = "This certificate is legally valid under Section 12/17 of RBD Act, 1969 for all government documentation (Aadhaar, Passport, School Admission)."
$g.DrawString($statutoryText, $fStatutory, [System.Drawing.Brushes]::Gray, ($w / 2), ($h - 55), $sfCenter)

$birthPath = "public\demo-docs\1_birth_certificate_khunt_harkishan.png"
$bmp.Save($birthPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Created successfully: $birthPath"

# ==============================================================================
# 2. GENERATE ELECTRICITY BILL (PGVCL GONDAL)
# ==============================================================================
Write-Host "Rendering Document 2: Official PGVCL Electricity Bill..."
$w = 1200
$h = 1650
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$g.Clear([System.Drawing.Color]::White)

$pgvclBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(2, 132, 199), 3)
$g.DrawRectangle($pgvclBorder, 35, 35, ($w - 70), ($h - 70))

$headerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(14, 116, 144))
$g.FillRectangle($headerBrush, 35, 35, ($w - 70), 110)

$fHeaderMain = Get-F "Arial" 22 $bBold
$fHeaderSub = Get-F "Arial" 12 $bBold
$fHeaderSmall = Get-F "Arial" 9.5 $bRegular

$g.DrawString("PASCHIM GUJARAT VIJ COMPANY LIMITED (PGVCL)", $fHeaderMain, [System.Drawing.Brushes]::White, ($w / 2), 52, $sfCenter)
$g.DrawString("A Government of Gujarat Undertaking (CIN: U40102GJ2003SGC042906)", $fHeaderSub, [System.Drawing.Brushes]::White, ($w / 2), 90, $sfCenter)
$g.DrawString("Sub-Division: GONDAL CITY SUB-DIVISION (Code: 342) | Circle: RAJKOT RURAL CIRCLE", $fHeaderSmall, [System.Drawing.Brushes]::White, ($w / 2), 116, $sfCenter)

$ribbonBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 249, 255))
$g.FillRectangle($ribbonBrush, 45, 155, ($w - 90), 48)
$g.DrawRectangle([System.Drawing.Pens]::SkyBlue, 45, 155, ($w - 90), 48)

$fRibbon = Get-F "Arial" 13 $bBold
$g.DrawString("ELECTRICITY CONSUMPTION BILL (RESIDENTIAL GENERAL PURPOSE - TARIFF RGP)", $fRibbon, [System.Drawing.Brushes]::DarkBlue, 60, 170)

$paidBadgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 252, 231))
$g.FillRectangle($paidBadgeBrush, ($w - 230), 162, 160, 34)
$g.DrawRectangle([System.Drawing.Pens]::MediumSeaGreen, ($w - 230), 162, 160, 34)
$fPaid = Get-F "Arial" 11 $bBold
$paidGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(22, 101, 52))
$g.DrawString("PAID / ONLINE REC", $fPaid, $paidGreen, ($w - 150), 171, $sfCenter)

$boxY = 220
$boxH = 290
$boxW = ($w - 110) / 2

$g.DrawRectangle([System.Drawing.Pens]::LightGray, 45, $boxY, $boxW, $boxH)
$boxHeaderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(241, 245, 249))
$g.FillRectangle($boxHeaderBrush, 45, $boxY, $boxW, 35)
$fBoxTitle = Get-F "Arial" 11.5 $bBold
$g.DrawString("1. CONSUMER PARTICULARS", $fBoxTitle, [System.Drawing.Brushes]::Black, 55, ($boxY + 9))

$fConsNo = Get-F "Arial" 15 $bBold
$fConsNorm = Get-F "Arial" 11 $bRegular
$fConsBold = Get-F "Arial" 11.5 $bBold

$g.DrawString("Consumer No:", $fConsNorm, [System.Drawing.Brushes]::Gray, 55, ($boxY + 50))
$g.DrawString("03482 / 91028 / 4", $fConsNo, [System.Drawing.Brushes]::DarkBlue, 55, ($boxY + 70))

$g.DrawString("Consumer Name:", $fConsNorm, [System.Drawing.Brushes]::Gray, 55, ($boxY + 105))
$g.DrawString("KHUNT VINODRAI NARANBHAI", $fConsBold, [System.Drawing.Brushes]::Black, 55, ($boxY + 125))
$g.DrawString("(Father of Applicant: Khunt Harkishan Vinodrai)", $fConsNorm, [System.Drawing.Brushes]::DarkSlateGray, 55, ($boxY + 145))

$g.DrawString("Premises / Installation Address:", $fConsNorm, [System.Drawing.Brushes]::Gray, 55, ($boxY + 175))
$g.DrawString("HOUSE NO. 12, PATEL STREET,", $fConsBold, [System.Drawing.Brushes]::Black, 55, ($boxY + 195))
$g.DrawString("NEAR S.T. BUS STAND, GONDAL - 360311", $fConsBold, [System.Drawing.Brushes]::Black, 55, ($boxY + 215))
$g.DrawString("Taluka: Gondal, District: Rajkot, Gujarat", $fConsNorm, [System.Drawing.Brushes]::DarkSlateGray, 55, ($boxY + 235))
$g.DrawString("Mobile: 9974442291", $fConsNorm, [System.Drawing.Brushes]::Black, 55, ($boxY + 260))

$rightX = 45 + $boxW + 20
$g.DrawRectangle([System.Drawing.Pens]::LightGray, $rightX, $boxY, $boxW, $boxH)
$g.FillRectangle($boxHeaderBrush, $rightX, $boxY, $boxW, 35)
$g.DrawString("2. BILLING & METER DATA", $fBoxTitle, [System.Drawing.Brushes]::Black, ($rightX + 10), ($boxY + 9))

$rightRows = @(
    @("Bill Number:", "PGVCL/2026/01/849201"),
    @("Bill Date:", "05/01/2026"),
    @("Payment Due Date:", "25/01/2026"),
    @("Meter Serial No:", "PG-9482104"),
    @("Tariff Category:", "RGP (Residential General)"),
    @("Sanctioned Load:", "2.00 kW (Single Phase)"),
    @("Multiplying Factor:", "1.00"),
    @("Billing Cycle:", "01/12/2025 to 01/01/2026 (Bi-Monthly)")
)
for ($r = 0; $r -lt $rightRows.Length; $r++) {
    $ry = $boxY + 48 + ($r * 29)
    $g.DrawString($rightRows[$r][0], $fConsNorm, [System.Drawing.Brushes]::Gray, ($rightX + 12), $ry)
    $g.DrawString($rightRows[$r][1], $fConsBold, [System.Drawing.Brushes]::Black, ($rightX + 220), $ry)
}

$mrY = 530
$mrH = 100
$g.DrawRectangle([System.Drawing.Pens]::LightSkyBlue, 45, $mrY, ($w - 90), $mrH)
$mrHeaderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238, 242, 255))
$g.FillRectangle($mrHeaderBrush, 45, $mrY, ($w - 90), 35)
$g.DrawString("3. CONSUMPTION DETAILS (METER READING)", $fBoxTitle, [System.Drawing.Brushes]::MidnightBlue, 55, ($mrY + 9))

$mrCols = @("Previous Reading", "Current Reading", "Difference (kWh)", "Units Billed", "Meter Condition")
$mrVals = @("14,210 kWh", "14,374 kWh", "164 kWh", "164 Units", "NORMAL OK")
$colW = ($w - 90) / 5
for ($c = 0; $c -lt 5; $c++) {
    $cx = 45 + ($c * $colW)
    if ($c -gt 0) { $g.DrawLine([System.Drawing.Pens]::LightSkyBlue, $cx, ($mrY + 35), $cx, ($mrY + $mrH)) }
    $g.DrawString($mrCols[$c], $fConsNorm, [System.Drawing.Brushes]::DarkSlateGray, ($cx + 10), ($mrY + 45))
    $g.DrawString($mrVals[$c], $fConsBold, [System.Drawing.Brushes]::DarkBlue, ($cx + 10), ($mrY + 70))
}

$calcY = 650
$calcH = 370
$g.DrawRectangle([System.Drawing.Pens]::LightGray, 45, $calcY, ($w - 90), $calcH)
$g.FillRectangle($boxHeaderBrush, 45, $calcY, ($w - 90), 35)
$g.DrawString("4. CHARGES & TARIFF BREAKUP", $fBoxTitle, [System.Drawing.Brushes]::Black, 55, ($calcY + 9))

$charges = @(
    @("Energy Charges (164 Units @ Slab Rate):", "Rs. 639.60"),
    @("Fixed Demand Charges:", "Rs. 70.00"),
    @("Fuel Surcharge Adjustment (FPPPA @ Rs 1.50/unit):", "Rs. 246.00"),
    @("Electricity Duty (Government of Gujarat 15%):", "Rs. 92.40"),
    @("Meter Rent & Prompt Payment Rebate:", "- Rs. 0.00"),
    @("Previous Arrears / Outstanding Balance:", "Rs. 0.00")
)
for ($k = 0; $k -lt $charges.Length; $k++) {
    $cy = $calcY + 45 + ($k * 36)
    $g.DrawString($charges[$k][0], $fConsNorm, [System.Drawing.Brushes]::DarkSlateGray, 60, $cy)
    $g.DrawString($charges[$k][1], $fConsBold, [System.Drawing.Brushes]::Black, ($w - 180), $cy)
    $g.DrawLine([System.Drawing.Pens]::GhostWhite, 45, ($cy + 30), ($w - 45), ($cy + 30))
}

$totalRowY = $calcY + 270
$totalBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 253, 244))
$g.FillRectangle($totalBrush, 45, $totalRowY, ($w - 90), 85)
$g.DrawRectangle([System.Drawing.Pens]::MediumSeaGreen, 45, $totalRowY, ($w - 90), 85)

$fTotalLabel = Get-F "Arial" 14 $bBold
$fTotalAmt = Get-F "Arial" 26 $bBold
$g.DrawString("NET AMOUNT PAYABLE:", $fTotalLabel, [System.Drawing.Brushes]::DarkGreen, 60, ($totalRowY + 16))
$g.DrawString("Rs. 1,048.00", $fTotalAmt, [System.Drawing.Brushes]::DarkGreen, ($w - 240), ($totalRowY + 12))
$g.DrawString("(In words: One Thousand Forty-Eight Rupees Only - Paid via Digital UPI)", $fConsNorm, [System.Drawing.Brushes]::DarkSlateGray, 60, ($totalRowY + 50))

$footY = 1045
$g.DrawRectangle([System.Drawing.Pens]::LightGray, 45, $footY, ($w - 90), 480)
$g.FillRectangle($boxHeaderBrush, 45, $footY, ($w - 90), 35)
$g.DrawString("5. OFFICIAL PAYMENT CONFIRMATION & AUTHENTICATION", $fBoxTitle, [System.Drawing.Brushes]::Black, 55, ($footY + 9))

$payY = $footY + 50
$g.DrawString("Transaction Reference (Txn ID):", $fConsNorm, [System.Drawing.Brushes]::Gray, 60, $payY)
$g.DrawString("PGVCL-UPI-9974442291-840291", $fConsBold, [System.Drawing.Brushes]::Black, 60, ($payY + 20))

$g.DrawString("Payment Timestamp:", $fConsNorm, [System.Drawing.Brushes]::Gray, 60, ($payY + 55))
$g.DrawString("12/01/2026 11:42 AM (Payment Successful Online)", $fConsBold, [System.Drawing.Brushes]::DarkGreen, 60, ($payY + 75))

$g.DrawString("Consumer Account Barcode:", $fConsNorm, [System.Drawing.Brushes]::Gray, 60, ($payY + 110))
Create-Barcode $g 60 ($payY + 135) 420 50 91028
$g.DrawString("* 0 3 4 8 2 - 9 1 0 2 8 - 4 *", $fConsNorm, [System.Drawing.Brushes]::Black, 160, ($payY + 192))

$qrX = $w - 220
Create-QrPattern $g $qrX ($payY + 20) 130
$g.DrawString("Scan to Verify Bill", $fHeaderSmall, [System.Drawing.Brushes]::Gray, ($qrX + 65), ($payY + 160), $sfCenter)

$pStampX = 540
$pStampY = $payY + 40
$pStampPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 2, 132, 199), 2.5)
$pStampBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 2, 132, 199))
$g.DrawEllipse($pStampPen, $pStampX, $pStampY, 130, 130)
$g.DrawEllipse($pStampPen, ($pStampX + 6), ($pStampY + 6), 118, 118)
$fPStamp = Get-F "Arial" 8.5 $bBold
$g.DrawString("PGVCL GONDAL", $fPStamp, $pStampBrush, ($pStampX + 65), ($pStampY + 25), $sfCenter)
$g.DrawString("PAID ONLINE", $fBoxTitle, $pStampBrush, ($pStampX + 65), ($pStampY + 50), $sfCenter)
$g.DrawString("SUB-DIV 342", $fPStamp, $pStampBrush, ($pStampX + 65), ($pStampY + 75), $sfCenter)
$g.DrawString("RAJKOT CIRCLE", $fPStamp, $pStampBrush, ($pStampX + 65), ($pStampY + 95), $sfCenter)

$pSignX = 730
$g.DrawString("For PASCHIM GUJARAT VIJ CO. LTD.", $fConsBold, [System.Drawing.Brushes]::Black, $pSignX, ($payY + 60))
$g.DrawBezier($signPen, ($pSignX + 20), ($payY + 115), ($pSignX + 50), ($payY + 90), ($pSignX + 90), ($payY + 130), ($pSignX + 160), ($payY + 105))
$g.DrawLine($signPen, ($pSignX + 20), ($payY + 125), ($pSignX + 180), ($payY + 125))
$g.DrawString("Deputy Engineer (O and M)", $fConsBold, [System.Drawing.Brushes]::Black, $pSignX, ($payY + 135))
$g.DrawString("Gondal City Sub-Division, PGVCL", $fConsNorm, [System.Drawing.Brushes]::DarkSlateGray, $pSignX, ($payY + 155))

$g.DrawString("This electricity bill is an authentic Government Address Proof under UIDAI / Gujarat Public Service delivery norms.", $fConsBold, [System.Drawing.Brushes]::DarkSlateGray, ($w / 2), ($h - 55), $sfCenter)

$elecPath = "public\demo-docs\2_electricity_bill_pgvcl_gondal.png"
$bmp.Save($elecPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Created successfully: $elecPath"

# ==============================================================================
# 3. GENERATE PAN CARD (INCOME TAX DEPARTMENT)
# ==============================================================================
Write-Host "Rendering Document 3: Official PAN Card..."
$w = 1100
$h = 700
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$g.Clear([System.Drawing.Color]::FromArgb(235, 245, 255))
$cardBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 64, 175), 4)
$g.DrawRectangle($cardBorderPen, 15, 15, ($w - 30), ($h - 30))

$panWmFont = Get-F "Arial" 40 $bBold
$panWmBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 0, 50, 150))
$g.DrawString("INCOME TAX DEPARTMENT", $panWmFont, $panWmBrush, 140, 280)
$g.DrawString("GOVT OF INDIA", $panWmFont, $panWmBrush, 320, 360)

$fPanGov = Get-F "Arial" 16 $bBold
$fPanDept = Get-F "Georgia" 22 $bBold
$fPanSub = Get-F "Arial" 11 $bBold

$g.DrawString("INCOME TAX DEPARTMENT", $fPanGov, [System.Drawing.Brushes]::Black, 45, 30)
$g.DrawString("GOVT. OF INDIA", $fPanGov, [System.Drawing.Brushes]::Black, ($w - 220), 30)

$g.DrawLine([System.Drawing.Pens]::SteelBlue, 45, 65, ($w - 45), 65)

$g.DrawString("Permanent Account Number Card", $fPanSub, [System.Drawing.Brushes]::DarkBlue, 45, 75)

$photoX = 55
$photoY = 115
$photoW = 200
$photoH = 260
$g.FillRectangle([System.Drawing.Brushes]::LightSteelBlue, $photoX, $photoY, $photoW, $photoH)
$g.DrawRectangle([System.Drawing.Pens]::Black, $photoX, $photoY, $photoW, $photoH)

$skinBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 195, 160))
$hairBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 25, 20))
$shirtBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 80, 160))

$g.FillEllipse($skinBrush, ($photoX + 55), ($photoY + 45), 90, 110)
$g.FillEllipse($hairBrush, ($photoX + 50), ($photoY + 35), 100, 55)
$g.FillRectangle($skinBrush, ($photoX + 85), ($photoY + 140), 30, 40)
$g.FillPie($shirtBrush, ($photoX + 15), ($photoY + 155), 170, 190, 180, 180)

$fPhotoLabel = Get-F "Arial" 9 $bBold
$g.DrawString("KHUNT HARKISHAN", $fPhotoLabel, [System.Drawing.Brushes]::White, ($photoX + 100), ($photoY + 235), $sfCenter)

Create-QrPattern $g 285 115 130
$g.DrawString("NSDL SIGNED QR", $fHeaderSmall, [System.Drawing.Brushes]::Gray, 350, 255, $sfCenter)

$holoX = $w - 180
$holoY = 115
$holoBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point $holoX, $holoY),
    (New-Object System.Drawing.Point ($holoX + 110), ($holoY + 110)),
    [System.Drawing.Color]::Gold,
    [System.Drawing.Color]::Silver
)
$g.FillRectangle($holoBrush, $holoX, $holoY, 110, 110)
$g.DrawRectangle([System.Drawing.Pens]::DarkGoldenrod, $holoX, $holoY, 110, 110)
$fHolo = Get-F "Arial" 9 $bBold
$g.DrawString("ITD SECURE", $fHolo, [System.Drawing.Brushes]::DarkBlue, ($holoX + 55), ($holoY + 35), $sfCenter)
$g.DrawString("HOLOGRAM", $fHolo, [System.Drawing.Brushes]::DarkBlue, ($holoX + 55), ($holoY + 55), $sfCenter)

$detailsX = 445
$detailsY = 120

$fPanNoLabel = Get-F "Arial" 11 $bBold
$fPanNo = Get-F "Arial" 30 $bBold
$fDetailLabel = Get-F "Arial" 11 $bRegular
$fDetailVal = Get-F "Arial" 16 $bBold

$g.DrawString("Permanent Account Number:", $fPanNoLabel, [System.Drawing.Brushes]::DarkSlateGray, $detailsX, $detailsY)
$g.DrawString("BQZPK4829J", $fPanNo, [System.Drawing.Brushes]::Black, $detailsX, ($detailsY + 25))

$g.DrawString("Name:", $fDetailLabel, [System.Drawing.Brushes]::DimGray, $detailsX, ($detailsY + 80))
$g.DrawString("KHUNT HARKISHAN VINODRAI", $fDetailVal, [System.Drawing.Brushes]::Black, $detailsX, ($detailsY + 102))

$g.DrawString("Father's Name:", $fDetailLabel, [System.Drawing.Brushes]::DimGray, $detailsX, ($detailsY + 140))
$g.DrawString("KHUNT VINODRAI NARANBHAI", $fDetailVal, [System.Drawing.Brushes]::Black, $detailsX, ($detailsY + 162))

$g.DrawString("Date of Birth:", $fDetailLabel, [System.Drawing.Brushes]::DimGray, $detailsX, ($detailsY + 200))
$g.DrawString("15/10/2003", $fDetailVal, [System.Drawing.Brushes]::Black, $detailsX, ($detailsY + 222))

$sigBoxX = 55
$sigBoxY = 410
$sigBoxW = 380
$sigBoxH = 110
$g.DrawRectangle([System.Drawing.Pens]::SteelBlue, $sigBoxX, $sigBoxY, $sigBoxW, $sigBoxH)
$g.FillRectangle([System.Drawing.Brushes]::White, $sigBoxX, $sigBoxY, $sigBoxW, $sigBoxH)
$fSigLabel = Get-F "Arial" 9.5 $bRegular
$g.DrawString("Signature:", $fSigLabel, [System.Drawing.Brushes]::Gray, ($sigBoxX + 10), ($sigBoxY + 8))

$sigPen = New-Object System.Drawing.Pen([System.Drawing.Color]::Navy, 3)
$g.DrawBezier($sigPen, ($sigBoxX + 40), ($sigBoxY + 70), ($sigBoxX + 70), ($sigBoxY + 25), ($sigBoxX + 110), ($sigBoxY + 85), ($sigBoxX + 150), ($sigBoxY + 45))
$g.DrawBezier($sigPen, ($sigBoxX + 150), ($sigBoxY + 45), ($sigBoxX + 190), ($sigBoxY + 85), ($sigBoxX + 230), ($sigBoxY + 30), ($sigBoxX + 280), ($sigBoxY + 60))
$g.DrawBezier($sigPen, ($sigBoxX + 280), ($sigBoxY + 60), ($sigBoxX + 310), ($sigBoxY + 35), ($sigBoxX + 330), ($sigBoxY + 75), ($sigBoxX + 350), ($sigBoxY + 60))
$g.DrawLine($sigPen, ($sigBoxX + 45), ($sigBoxY + 80), ($sigBoxX + 355), ($sigBoxY + 80))

$botRightX = 475
$botRightY = 410
$fBotText = Get-F "Arial" 10.5 $bRegular
$g.DrawString("Issued under Section 139A of Income-tax Act, 1961.", $fBotText, [System.Drawing.Brushes]::DarkSlateGray, $botRightX, ($botRightY + 10))
$g.DrawString("Government of India Photo Identity and Age Proof.", $fBotText, [System.Drawing.Brushes]::DarkSlateGray, $botRightX, ($botRightY + 35))
$g.DrawString("Valid across India for all official government purposes.", $fBotText, [System.Drawing.Brushes]::DarkSlateGray, $botRightX, ($botRightY + 60))

$panFooterBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 58, 138))
$g.FillRectangle($panFooterBrush, 15, ($h - 85), ($w - 30), 70)
$fPanFoot = Get-F "Arial" 11 $bBold
$g.DrawString("INCOME TAX DEPARTMENT - GOVT. OF INDIA - NSDL SECURE CARD REPOSITORY", $fPanFoot, [System.Drawing.Brushes]::White, ($w / 2), ($h - 52), $sfCenter)

$panPath = "public\demo-docs\3_pan_card_khunt_harkishan.png"
$bmp.Save($panPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Created successfully: $panPath"

Write-Host "ALL 3 DEMO DOCUMENTS GENERATED PERFECTLY IN public\demo-docs\!"
