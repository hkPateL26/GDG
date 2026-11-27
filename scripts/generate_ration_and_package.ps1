Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem

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

function Create-QrPattern($g, $x, $y, $size, $seed) {
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
    
    $rand = New-Object System.Random($seed)
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
# RENDER GUJARAT NFSA DIGITAL RATION CARD (FORM NO. A)
# ==============================================================================
Write-Host "Rendering Official Gujarat NFSA Digital Ration Card..."
$w = 1200
$h = 1650
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$g.Clear([System.Drawing.Color]::FromArgb(255, 253, 248))

$borderPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 83, 9), 5) # Amber/Brown official border
$borderPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(245, 158, 11), 2)
$g.DrawRectangle($borderPen1, 35, 35, ($w - 70), ($h - 70))
$g.DrawRectangle($borderPen2, 45, 45, ($w - 90), ($h - 90))

# Watermark
$wmFont = Get-F "Georgia" 44 $bBold
$wmBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 180, 83, 9))
$g.DrawString("GOVERNMENT OF GUJARAT", $wmFont, $wmBrush, 170, 720)
$g.DrawString("NFSA RATION CARD", $wmFont, $wmBrush, 280, 820)
$g.DrawString("DISTRICT SUPPLY OFFICE RAJKOT", $wmFont, $wmBrush, 130, 920)

# Header Fonts
$fGov = Get-F "Georgia" 24 $bBold
$fSubGov = Get-F "Arial" 13 $bBold
$fTitle = Get-F "Georgia" 26 $bBold
$fLaw = Get-F "Arial" 10.5 $bRegular
$fBoxTitle = Get-F "Arial" 12 $bBold
$fLabel = Get-F "Arial" 11 $bRegular
$fValBold = Get-F "Arial" 12 $bBold
$fSmall = Get-F "Arial" 9.5 $bRegular

$cDarkAmber = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(146, 64, 14))
$cDarkSlate = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))

$g.DrawString("ગુજરાત સરકાર • GOVERNMENT OF GUJARAT", $fGov, $cDarkAmber, ($w / 2), 65, $sfCenter)
$g.DrawString("અન્ન, નાગરિક પુરવઠા અને ગ્રાહકોની બાબતોનો વિભાગ (FOOD & CIVIL SUPPLIES DEPT)", $fSubGov, $cDarkSlate, ($w / 2), 108, $sfCenter)
$g.DrawString("રાષ્ટ્રીય અન્ન સુરક્ષા કાયદો - ૨૦૧૩ (NFSA) હેઠળ ડિજિટલ રેશન કાર્ડ", $fTitle, $cDarkAmber, ($w / 2), 135, $sfCenter)
$g.DrawString("National Food Security Act (NFSA 2013) Statutory Digital Ration Card Record", $fLaw, [System.Drawing.Brushes]::DimGray, ($w / 2), 178, $sfCenter)

$g.DrawLine($borderPen2, 90, 205, ($w - 90), 205)

# 1. Card Overview Box
$box1Y = 220
$box1H = 210
$boxHeaderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 243, 199))
$g.DrawRectangle([System.Drawing.Pens]::Goldenrod, 55, $box1Y, ($w - 110), $box1H)
$g.FillRectangle($boxHeaderBrush, 55, $box1Y, ($w - 110), 36)
$g.DrawString("૧. રેશન કાર્ડ પ્રાથમિક વિગતો (CARD & FAIR PRICE SHOP PARTICULARS)", $fBoxTitle, $cDarkAmber, 70, ($box1Y + 9))

# Fields in Box 1
$row1Y = $box1Y + 50
$g.DrawString("રેશન કાર્ડ નંબર (Ration Card No):", $fLabel, [System.Drawing.Brushes]::DimGray, 70, $row1Y)
$fCardNo = Get-F "Arial" 20 $bBold
$g.DrawString("242006186280", $fCardNo, [System.Drawing.Brushes]::Black, 70, ($row1Y + 22))

$g.DrawString("કાર્ડનો પ્રકાર (Card Category):", $fLabel, [System.Drawing.Brushes]::DimGray, 480, $row1Y)
$fBadge = Get-F "Arial" 13 $bBold
$g.DrawString("NFSA - PHH (અગ્રતા ધરાવતું કુટુંબ)", $fBadge, [System.Drawing.Brushes]::DarkGreen, 480, ($row1Y + 24))

$g.DrawString("વાજબી ભાવની દુકાન (FPS Shop):", $fLabel, [System.Drawing.Brushes]::DimGray, 820, $row1Y)
$g.DrawString("FPS-GONDAL-042 (ગોમટા મંડળી)", $fValBold, [System.Drawing.Brushes]::Black, 820, ($row1Y + 24))

$row2Y = $box1Y + 115
$g.DrawString("જિલ્લો (District):", $fLabel, [System.Drawing.Brushes]::DimGray, 70, $row2Y)
$g.DrawString("રાજકોટ (Rajkot)", $fValBold, [System.Drawing.Brushes]::Black, 70, ($row2Y + 20))

$g.DrawString("તાલુકો (Taluka):", $fLabel, [System.Drawing.Brushes]::DimGray, 300, $row2Y)
$g.DrawString("ગોંડલ (Gondal)", $fValBold, [System.Drawing.Brushes]::Black, 300, ($row2Y + 20))

$g.DrawString("ગામ / વોર્ડ (Village):", $fLabel, [System.Drawing.Brushes]::DimGray, 530, $row2Y)
$g.DrawString("ગોમટા (Gomta)", $fValBold, [System.Drawing.Brushes]::Black, 530, ($row2Y + 20))

$g.DrawString("ગેસ કનેક્શન (Gas Status):", $fLabel, [System.Drawing.Brushes]::DimGray, 820, $row2Y)
$g.DrawString("HP Gas (2 Cylinders - Dual)", $fValBold, [System.Drawing.Brushes]::DarkSlateBlue, 820, ($row2Y + 20))

# Barcode in Box 1
Create-Barcode $g 70 ($box1Y + 165) 450 32 186280
$g.DrawString("* 2 4 2 0 0 6 1 8 6 2 8 0 *", $fSmall, [System.Drawing.Brushes]::Black, 180, ($box1Y + 198))

# 2. Family Head & Address Box
$box2Y = 450
$box2H = 200
$g.DrawRectangle([System.Drawing.Pens]::Goldenrod, 55, $box2Y, ($w - 110), $box2H)
$g.FillRectangle($boxHeaderBrush, 55, $box2Y, ($w - 110), 36)
$g.DrawString("૨. કુટુંબના વડા અને રહેઠાણની વિગતો (HEAD OF FAMILY & RESIDENTIAL DETAILS)", $fBoxTitle, $cDarkAmber, 70, ($box2Y + 9))

# Head Photo
$photoX = 75
$photoY = $box2Y + 48
$photoW = 105
$photoH = 135
$photoPath = "public\demo-docs\aadhaar_photo_hq.png"
if (Test-Path $photoPath) {
    $pImg = [System.Drawing.Image]::FromFile($photoPath)
    $g.DrawImage($pImg, $photoX, $photoY, $photoW, $photoH)
    $pImg.Dispose()
} else {
    $g.FillRectangle([System.Drawing.Brushes]::LightGray, $photoX, $photoY, $photoW, $photoH)
}
$g.DrawRectangle([System.Drawing.Pens]::DarkGoldenrod, $photoX, $photoY, $photoW, $photoH)
$g.DrawString("કુટુંબના વડા", $fSmall, [System.Drawing.Brushes]::DimGray, ($photoX + 18), ($photoY + $photoH + 2))

$headInfoX = 210
$hRow1Y = $box2Y + 52
$g.DrawString("કુટુંબના વડાનું નામ (Head of Family):", $fLabel, [System.Drawing.Brushes]::DimGray, $headInfoX, $hRow1Y)
$fHeadName = Get-F "Arial" 15 $bBold
$g.DrawString("હરી વિનોદરાઈ પટેલ (HARI VINODRAI PATEL)", $fHeadName, [System.Drawing.Brushes]::Black, $headInfoX, ($hRow1Y + 22))

$g.DrawString("પિતા / પતિનું નામ (Father/Husband Name):", $fLabel, [System.Drawing.Brushes]::DimGray, 720, $hRow1Y)
$g.DrawString("વિનોદરાઈ નારણભાઈ પટેલ (Vinodrai N. Patel)", $fValBold, [System.Drawing.Brushes]::Black, 720, ($hRow1Y + 22))

$hRow2Y = $box2Y + 112
$g.DrawString("રહેઠાણનું સરનામું (Residential Address):", $fLabel, [System.Drawing.Brushes]::DimGray, $headInfoX, $hRow2Y)
$g.DrawString("મકાન નં. ૧૨, પટેલ શેરી, એસ.ટી. બસ સ્ટેન્ડ પાસે, મુ. ગોમટા, તા. ગોંડલ, જિ. રાજકોટ - ૩૬૦૦૦૪", $fValBold, [System.Drawing.Brushes]::Black, $headInfoX, ($hRow2Y + 22))

$hRow3Y = $box2Y + 162
$g.DrawString("આધાર ઓળખ: XXXX-XXXX-1413 (UIDAI Verified)", $fSmall, [System.Drawing.Brushes]::DarkGreen, $headInfoX, $hRow3Y)
$g.DrawString("મોબાઈલ નં.: +91 99744 42291", $fSmall, [System.Drawing.Brushes]::Black, ($headInfoX + 320), $hRow3Y)
$g.DrawString("વાર્ષિક આવક જૂથ: ₹ ૧,૨૦,૦૦૦/-", $fSmall, [System.Drawing.Brushes]::Black, ($headInfoX + 540), $hRow3Y)

# 3. Family Members Table Box
$box3Y = 670
$box3H = 370
$g.DrawRectangle([System.Drawing.Pens]::Goldenrod, 55, $box3Y, ($w - 110), $box3H)
$g.FillRectangle($boxHeaderBrush, 55, $box3Y, ($w - 110), 36)
$g.DrawString("૩. રેશન કાર્ડમાં સમાવિષ્ટ કુટુંબના સભ્યોની યાદી (INCLUDED FAMILY MEMBERS - 4 MEMBERS)", $fBoxTitle, $cDarkAmber, 70, ($box3Y + 9))

# Table Header
$thY = $box3Y + 42
$thBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 240, 240))
$g.FillRectangle($thBrush, 60, $thY, ($w - 120), 32)
$g.DrawRectangle([System.Drawing.Pens]::LightGray, 60, $thY, ($w - 120), 32)

$fTh = Get-F "Arial" 10.5 $bBold
$g.DrawString("ક્રમ", $fTh, [System.Drawing.Brushes]::Black, 75, ($thY + 7))
$g.DrawString("સભ્યનું પૂરું નામ (Member Name)", $fTh, [System.Drawing.Brushes]::Black, 130, ($thY + 7))
$g.DrawString("સંબંધ (Relation)", $fTh, [System.Drawing.Brushes]::Black, 490, ($thY + 7))
$g.DrawString("જાતિ (Gender)", $fTh, [System.Drawing.Brushes]::Black, 640, ($thY + 7))
$g.DrawString("ઉંમર (Age)", $fTh, [System.Drawing.Brushes]::Black, 760, ($thY + 7))
$g.DrawString("આધાર ક્રમાંક (Aadhaar)", $fTh, [System.Drawing.Brushes]::Black, 860, ($thY + 7))
$g.DrawString("સ્થિતિ (Status)", $fTh, [System.Drawing.Brushes]::Black, 1020, ($thY + 7))

# Table Rows
$members = @(
    @("૧", "હરી વિનોદરાઈ પટેલ (Hari Vinodrai Patel)", "મુખ્ય વડા (Self)", "પુરુષ (Male)", "૪૨ વર્ષ", "XXXX-XXXX-1413", "સક્રિય (Active)"),
    @("૨", "પ્રિયાબેન હરી પટેલ (Priyaben Hari Patel)", "પત્ની (Wife)", "સ્ત્રી (Female)", "૩૮ વર્ષ", "XXXX-XXXX-2555", "સક્રિય (Active)"),
    @("૩", "હરકિશન હરી પટેલ (Harkishan Hari Patel)", "પુત્ર (Son)", "પુરુષ (Male)", "૨૦ વર્ષ", "XXXX-XXXX-4829", "સક્રિય (Active)"),
    @("૪", "આરતીબેન હરી પટેલ (Aartiben Hari Patel)", "પુત્રી (Daughter)", "સ્ત્રી (Female)", "૧૬ વર્ષ", "XXXX-XXXX-8821", "સક્રિય (Active)")
)

$fRow = Get-F "Arial" 11 $bRegular
$fRowBold = Get-F "Arial" 11 $bBold
for ($m = 0; $m -lt $members.Length; $m++) {
    $ry = $thY + 36 + ($m * 52)
    $rowBg = if ($m % 2 -eq 1) { New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 250, 250)) } else { [System.Drawing.Brushes]::White }
    $g.FillRectangle($rowBg, 60, $ry, ($w - 120), 48)
    $g.DrawRectangle([System.Drawing.Pens]::Gainsboro, 60, $ry, ($w - 120), 48)

    $rowColor = [System.Drawing.Brushes]::Black
    $g.DrawString($members[$m][0], $fRowBold, $rowColor, 80, ($ry + 14))
    $g.DrawString($members[$m][1], $fRowBold, $rowColor, 130, ($ry + 14))
    $g.DrawString($members[$m][2], $fRow, [System.Drawing.Brushes]::DarkSlateGray, 490, ($ry + 14))
    $g.DrawString($members[$m][3], $fRow, [System.Drawing.Brushes]::DarkSlateGray, 640, ($ry + 14))
    $g.DrawString($members[$m][4], $fRow, [System.Drawing.Brushes]::Black, 765, ($ry + 14))
    $g.DrawString($members[$m][5], $fRow, [System.Drawing.Brushes]::DimGray, 860, ($ry + 14))
    $g.DrawString("✓ માન્ય", $fRowBold, [System.Drawing.Brushes]::DarkGreen, 1025, ($ry + 14))
}

$noteY = $box3Y + 325
$g.DrawString("* તમામ સભ્યોના આધાર કાર્ડ બાયોમેટ્રિકલી ઈ-કેવાયસી (e-KYC) પ્રમાણિત થયેલ છે. અનાજ ઉપાડ માટે પીઓએસ (PoS) મશીન પર અંગૂઠો માન્ય રહેશે.", $fSmall, [System.Drawing.Brushes]::DimGray, 70, $noteY)

# 4. Entitlements & Allotment Box
$box4Y = 1060
$box4H = 170
$g.DrawRectangle([System.Drawing.Pens]::Goldenrod, 55, $box4Y, ($w - 110), $box4H)
$g.FillRectangle($boxHeaderBrush, 55, $box4Y, ($w - 110), 36)
$g.DrawString("૪. માસિક અનાજ પુરવઠા જથ્થો (MONTHLY STATUTORY SUBSIDIZED ALLOTMENT)", $fBoxTitle, $cDarkAmber, 70, ($box4Y + 9))

$entList = @(
    @("ઘઉં (Wheat - Fortified):", "૧૪ કિલો (₹ ૨.૦૦/કિલો)"),
    @("ચોખા (Rice - Grade A):", "૬ કિલો (₹ ૩.૦૦/કિલો)"),
    @("ખાંડ (Sugar - BPL Quota):", "૧.૫ કિલો (₹ ૧૫.૦૦/કિલો)"),
    @("તુવેર દાળ / ચણા:", "૧ કિલો (₹ ૩૦.૦૦/કિલો)"),
    @("આયોડાઇઝ્ડ મીઠું:", "૧ કિલો (₹ ૧.૦૦/કિલો)")
)
for ($e = 0; $e -lt $entList.Length; $e++) {
    $ey = $box4Y + 48 + ($e * 23)
    $g.DrawString($entList[$e][0], $fLabel, [System.Drawing.Brushes]::DarkSlateGray, 75, $ey)
    $g.DrawString($entList[$e][1], $fValBold, [System.Drawing.Brushes]::DarkGreen, 300, $ey)
}

# 5. Verification Seal, QR & Digital Signature Box
$box5Y = 1250
$box5H = 290
$g.DrawRectangle([System.Drawing.Pens]::Goldenrod, 55, $box5Y, ($w - 110), $box5H)
$g.FillRectangle($boxHeaderBrush, 55, $box5Y, ($w - 110), 36)
$g.DrawString("૫. ડિજિટલ પ્રમાણીકરણ અને સત્તાવાર મહોર (DIGITAL CERTIFICATION & QR SEAL)", $fBoxTitle, $cDarkAmber, 70, ($box5Y + 9))

# QR Code
$qrSize = 135
$qrX = 80
$qrY = $box5Y + 55
Create-QrPattern $g $qrX $qrY $qrSize 186280
$g.DrawString("NFSA Official QR", $fSmall, [System.Drawing.Brushes]::DimGray, ($qrX + 18), ($qrY + $qrSize + 4))

$certInfoX = 260
$cY1 = $box5Y + 60
$g.DrawString("ડિજિટલ પ્રમાણપત્ર ક્રમાંક (Digital Cert Ref):", $fLabel, [System.Drawing.Brushes]::DimGray, $certInfoX, $cY1)
$g.DrawString("GJ-RC-2026-RAJKOT-0482910-NFSA", $fValBold, [System.Drawing.Brushes]::Black, $certInfoX, ($cY1 + 22))

$cY2 = $box5Y + 115
$g.DrawString("ઇશ્યૂ તારીખ (Issue Date):", $fLabel, [System.Drawing.Brushes]::DimGray, $certInfoX, $cY2)
$g.DrawString("12/01/2026", $fValBold, [System.Drawing.Brushes]::Black, $certInfoX, ($cY2 + 20))

$g.DrawString("માન્યતા સમયગાળો (Validity):", $fLabel, [System.Drawing.Brushes]::DimGray, ($certInfoX + 220), $cY2)
$g.DrawString("આજીવન (Lifetime - Subject to NFSA Audit)", $fValBold, [System.Drawing.Brushes]::DarkGreen, ($certInfoX + 220), ($cY2 + 20))

$cY3 = $box5Y + 168
$g.DrawString("ડિજિટલ સહી (Cryptographic Signature):", $fLabel, [System.Drawing.Brushes]::DimGray, $certInfoX, $cY3)
$g.DrawString("✓ Digitally Signed by DSO Rajkot (Govt of Gujarat DSC Sub-CA)", $fValBold, [System.Drawing.Brushes]::DarkSlateBlue, $certInfoX, ($cY3 + 20))

# Official Round Stamp
$stampX = $w - 280
$stampY = $box5Y + 52
$stampPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 146, 64, 14), 2.5)
$stampBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 146, 64, 14))
$g.DrawEllipse($stampPen, $stampX, $stampY, 130, 130)
$g.DrawEllipse($stampPen, ($stampX + 6), ($stampY + 6), 118, 118)
$fStamp = Get-F "Arial" 8 $bBold
$g.DrawString("DISTRICT SUPPLY OFFICE", $fStamp, $stampBrush, ($stampX + 65), ($stampY + 25), $sfCenter)
$g.DrawString("FOOD & DRUGS", $fBoxTitle, $stampBrush, ($stampX + 65), ($stampY + 50), $sfCenter)
$g.DrawString("RAJKOT DISTRICT", $fStamp, $stampBrush, ($stampX + 65), ($stampY + 75), $sfCenter)
$g.DrawString("GOVT OF GUJARAT", $fStamp, $stampBrush, ($stampX + 65), ($stampY + 95), $sfCenter)

# Officer Signature line
$sigPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 58, 138), 2.5)
$g.DrawBezier($sigPen, ($stampX - 10), ($stampY + 155), ($stampX + 30), ($stampY + 130), ($stampX + 70), ($stampY + 170), ($stampX + 130), ($stampY + 145))
$g.DrawLine($sigPen, ($stampX - 10), ($stampY + 165), ($stampX + 140), ($stampY + 165))
$g.DrawString("જિલ્લા પુરવઠા અધિકારી (DSO)", $fValBold, [System.Drawing.Brushes]::Black, ($stampX + 65), ($stampY + 175), $sfCenter)
$g.DrawString("District Supply Office, Rajkot", $fSmall, [System.Drawing.Brushes]::DimGray, ($stampX + 65), ($stampY + 195), $sfCenter)

$footNoteY = $h - 55
$g.DrawString("આ ડિજિટલ રેશન કાર્ડ ગુજરાત સરકારના જાહેર સેવા વિતરણ અધિનિયમ ૨૦૧૩ હેઠળ માન્ય સત્તાવાર દસ્તાવેજ છે.", $fSmall, [System.Drawing.Brushes]::DimGray, ($w / 2), $footNoteY, $sfCenter)

# Save Ration Card
$rationCardPath = "public\demo-docs\6_ration_card_gujarat.png"
$bmp.Save($rationCardPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Created successfully: $rationCardPath"

# ==============================================================================
# COPY & PACKAGE ALL 6 DEMO DOCUMENTS
# ==============================================================================
$outWorkspace = "F:\gdg goverrnment\demo-documents"
$outDownloads = "C:\Users\JeeT\Downloads\NagrikSeva_Demo_Documents"
$outArtifact = "C:\Users\JeeT\.gemini\antigravity\brain\340c0c1a-4d84-48d9-ab9f-054b5aa25be4"

New-Item -ItemType Directory -Force -Path $outWorkspace | Out-Null
New-Item -ItemType Directory -Force -Path $outDownloads | Out-Null

$fileMap = @(
    @{ Src = "public\demo-docs\1_birth_certificate_khunt_harkishan.png"; Dst = "1_Birth_Certificate.png" },
    @{ Src = "public\demo-docs\aadhaar_photo_hq.png";                     Dst = "2_Passport_Size_Photo.png" },
    @{ Src = "public\demo-docs\2_electricity_bill_pgvcl_gondal.png";     Dst = "3_PGVCL_Electricity_Bill.png" },
    @{ Src = "public\demo-docs\aadhaar_card_reference.png";             Dst = "4_Aadhaar_Card.png" },
    @{ Src = "public\demo-docs\3_pan_card_khunt_harkishan.png";          Dst = "5_PAN_Card.png" },
    @{ Src = "public\demo-docs\6_ration_card_gujarat.png";              Dst = "6_Ration_Card.png" }
)

foreach ($item in $fileMap) {
    if (Test-Path $item.Src) {
        Copy-Item $item.Src (Join-Path $outWorkspace $item.Dst) -Force
        Copy-Item $item.Src (Join-Path $outDownloads $item.Dst) -Force
        Copy-Item $item.Src (Join-Path $outArtifact $item.Dst) -Force
        Write-Host "Copied: $($item.Dst)"
    } else {
        Write-Warning "Source file missing: $($item.Src)"
    }
}

# Create Convenient ZIP Archive in both locations
$zipName = "NagrikSeva_All_6_Demo_Documents.zip"
$zipPathWorkspace = Join-Path "F:\gdg goverrnment" $zipName
$zipPathDownloads = Join-Path "C:\Users\JeeT\Downloads" $zipName
$zipPathArtifact = Join-Path $outArtifact $zipName

if (Test-Path $zipPathWorkspace) { Remove-Item $zipPathWorkspace -Force }
if (Test-Path $zipPathDownloads) { Remove-Item $zipPathDownloads -Force }
if (Test-Path $zipPathArtifact) { Remove-Item $zipPathArtifact -Force }

[System.IO.Compression.ZipFile]::CreateFromDirectory($outWorkspace, $zipPathWorkspace)
Copy-Item $zipPathWorkspace $zipPathDownloads -Force
Copy-Item $zipPathWorkspace $zipPathArtifact -Force

Write-Host "`nSUCCESS! ALL 6 DEMO DOCUMENTS & ZIP BUNDLE CREATED LOCALLY!"
Write-Host "Local Workspace Folder: $outWorkspace"
Write-Host "Downloads Folder: $outDownloads"
Write-Host "Direct ZIP: $zipPathDownloads"
