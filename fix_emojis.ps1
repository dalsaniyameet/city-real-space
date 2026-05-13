$f = 'c:\Users\meetd\Downloads\City Real Space\admin\index.html'
$lines = Get-Content $f -Encoding UTF8
for ($i = 0; $i -lt $lines.Count; $i++) {
  $l = $lines[$i]
  if     ($l -match 'furnItem.*Lights')           { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Lights"/> &#128161; Lights</label>' }
  elseif ($l -match 'furnItem.*value="Fans"')      { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Fans"/> &#127744; Fans</label>' }
  elseif ($l -match 'furnItem.*value="AC"')        { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="AC"/> &#10052; AC</label>' }
  elseif ($l -match 'furnItem.*value="Beds"')      { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Beds"/> &#128716; Beds</label>' }
  elseif ($l -match 'furnItem.*Wardrobe')          { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Wardrobe"/> &#128084; Wardrobe</label>' }
  elseif ($l -match 'furnItem.*value="Sofa"')      { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Sofa"/> &#128715; Sofa</label>' }
  elseif ($l -match 'furnItem.*Dining')            { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Dining Table"/> &#127869; Dining Table</label>' }
  elseif ($l -match 'furnItem.*Modular')           { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Modular Kitchen"/> &#127859; Modular Kitchen</label>' }
  elseif ($l -match 'furnItem.*Chimney')           { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Chimney"/> &#128168; Chimney</label>' }
  elseif ($l -match 'furnItem.*Fridge')            { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Fridge"/> &#129514; Fridge</label>' }
  elseif ($l -match 'furnItem.*Washing')           { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Washing Machine"/> &#129511; Washing Machine</label>' }
  elseif ($l -match 'furnItem.*Geyser')            { $lines[$i] = '                  <label class="furn-item"><input type="checkbox" name="furnItem" value="Geyser"/> &#128703; Geyser</label>' }
  elseif ($l -match 'Furnishing Status')           { $lines[$i] = $l -replace '<label>.*Furnishing Status', '<label>&#128715; Furnishing Status' }
  elseif ($l -match '<label>.*Property Age')       { $lines[$i] = $l -replace '<label>.*Property Age', '<label>&#127959; Property Age' }
  elseif ($l -match '>.*Key Amenities<')           { $lines[$i] = $l -replace '>.*Key Amenities<', '>&#127968; Key Amenities<' }
  elseif ($l -match '<label>.*Security<')          { $lines[$i] = $l -replace '<label>.*Security<', '<label>&#128274; Security<' }
  elseif ($l -match '<label>.*CCTV<')              { $lines[$i] = $l -replace '<label>.*CCTV<', '<label>&#128249; CCTV<' }
  elseif ($l -match '<label>.*Water Supply<')      { $lines[$i] = $l -replace '<label>.*Water Supply<', '<label>&#128167; Water Supply<' }
  elseif ($l -match '<label>.*Power Backup<')      { $lines[$i] = $l -replace '<label>.*Power Backup<', '<label>&#9889; Power Backup<' }
  elseif ($l -match '<label>.*Garden / Park<')     { $lines[$i] = $l -replace '<label>.*Garden / Park<', '<label>&#127807; Garden / Park<' }
  elseif ($l -match '<label>.*Gym / Pool / Club<') { $lines[$i] = $l -replace '<label>.*Gym / Pool / Club<', '<label>&#127947; Gym / Pool / Club<' }
  elseif ($l -match '<label>.*Available From<')    { $lines[$i] = $l -replace '<label>.*Available From<', '<label>&#128197; Available From<' }
  elseif ($l -match '<label>.*Suitable For<')      { $lines[$i] = $l -replace '<label>.*Suitable For<', '<label>&#127919; Suitable For<' }
  elseif ($l -match 'white-space:nowrap.*Covered') { $lines[$i] = $l -replace '>.*Covered<', '>&#127968; Covered<' }
  elseif ($l -match 'white-space:nowrap.*Open')    { $lines[$i] = $l -replace '>.*Open<', '>&#127795; Open<' }
  elseif ($l -match '<label>.*All Inclusive<')     { $lines[$i] = $l -replace '<label>.*All Inclusive<', '<label>&#128176; All Inclusive<' }
  elseif ($l -match '<label>.*Price Negotiable<')  { $lines[$i] = $l -replace '<label>.*Price Negotiable<', '<label>&#129309; Price Negotiable<' }
  elseif ($l -match '<label>.*Tax.*Govt')          { $lines[$i] = $l -replace '<label>.*Tax', '<label>&#127970; Tax' }
  elseif ($l -match '<label>.*Booking Amount')     { $lines[$i] = $l -replace '<label>.*Booking Amount', '<label>&#128179; Booking Amount' }
  elseif ($l -match '<label>.*Maintenance.*Monthly') { $lines[$i] = $l -replace '<label>.*Maintenance', '<label>&#128197; Maintenance' }
  elseif ($l -match '<label>.*Annual Dues')        { $lines[$i] = $l -replace '<label>.*Annual Dues', '<label>&#128198; Annual Dues' }
  elseif ($l -match '<label>.*Membership Charge')  { $lines[$i] = $l -replace '<label>.*Membership Charge', '<label>&#127941; Membership Charge' }
}
Set-Content $f $lines -Encoding UTF8
Write-Host 'All emojis fixed!'
