f = open('c:/Users/meetd/Downloads/City Real Space/admin/index.html', encoding='utf-8')
lines = f.readlines()
f.close()

new_comm = '''            <!-- ===== COMMERCIAL DETAILS ===== -->
            <div id="commercialFields" style="display:none">

              <div class="comm-section-head"><i class="fa-solid fa-building"></i> Floor &amp; Building Info</div>
              <div class="comm-field-row">
                <div class="comm-field">
                  <label><i class="fa-solid fa-layer-group"></i> Total Floors in Building</label>
                  <select id="cTotalFloors"><option value="">Select</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15+</option></select>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-stairs"></i> Your Floor</label>
                  <select id="cYourFloor"><option value="">Select</option><option>Ground</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13+</option></select>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-elevator"></i> Lift</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cLift','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cLift','Yes')">Yes</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cLift','2 Lifts')">2 Lifts</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cLift','High Speed')">High Speed</button>
                  </div>
                  <input type="hidden" id="cLift" value="No"/>
                </div>
              </div>

              <hr class="comm-divider"/>
              <div class="comm-section-head"><i class="fa-solid fa-utensils"></i> Pantry &amp; Furnishing</div>
              <div class="comm-field-row cols-2">
                <div class="comm-field">
                  <label><i class="fa-solid fa-kitchen-set"></i> Pantry</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cPantry','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cPantry','Dry Pantry')">Dry Pantry</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cPantry','Wet Pantry')">Wet Pantry</button>
                  </div>
                  <input type="hidden" id="cPantry" value="No"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-couch"></i> Furnishing</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cFurnishing','Bare Shell')">Bare Shell</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cFurnishing','Semi Furnished')">Semi Furnished</button>
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cFurnishing','Fully Furnished')">Fully Furnished</button>
                  </div>
                  <input type="hidden" id="cFurnishing" value="Fully Furnished"/>
                </div>
              </div>

              <hr class="comm-divider"/>
              <div class="comm-section-head"><i class="fa-solid fa-chair"></i> Workspace Setup</div>
              <div class="comm-field-row">
                <div class="comm-field">
                  <label><i class="fa-solid fa-briefcase"></i> Cabins</label>
                  <input type="number" id="cCabins" placeholder="e.g. 2" min="0"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-laptop"></i> Workstations</label>
                  <input type="number" id="cWorkstations" placeholder="e.g. 12" min="0"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-chalkboard-user"></i> Conference Room</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cConference','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cConference','Yes')">Yes</button>
                  </div>
                  <input type="hidden" id="cConference" value="No"/>
                </div>
              </div>
              <div class="comm-field-row cols-2">
                <div class="comm-field">
                  <label><i class="fa-solid fa-person-booth"></i> Reception</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cReception','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cReception','Yes')">Yes</button>
                  </div>
                  <input type="hidden" id="cReception" value="No"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-plug"></i> UPS</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cUPS','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cUPS','Yes')">Yes</button>
                  </div>
                  <input type="hidden" id="cUPS" value="No"/>
                </div>
              </div>

              <hr class="comm-divider"/>
              <div class="comm-section-head"><i class="fa-solid fa-bolt"></i> Features</div>
              <div class="comm-field-row">
                <div class="comm-field">
                  <label><i class="fa-solid fa-snowflake"></i> AC</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cAC','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cAC','Split AC')">Split AC</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cAC','Central AC')">Central AC</button>
                  </div>
                  <input type="hidden" id="cAC" value="No"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-wifi"></i> Internet</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cInternet','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cInternet','Available')">Available</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cInternet','Included')">Included</button>
                  </div>
                  <input type="hidden" id="cInternet" value="No"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-wind"></i> Oxygen Duct</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cOxygenDuct','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cOxygenDuct','Yes')">Yes</button>
                  </div>
                  <input type="hidden" id="cOxygenDuct" value="No"/>
                </div>
              </div>

              <hr class="comm-divider"/>
              <div class="comm-section-head"><i class="fa-solid fa-file-shield"></i> Legal &amp; Ownership</div>
              <div class="comm-field-row">
                <div class="comm-field">
                  <label><i class="fa-solid fa-user-tie"></i> Ownership Type</label>
                  <select id="cOwnership"><option value="">Select</option><option>Freehold</option><option>Leasehold</option><option>Co-operative Society</option><option>Power of Attorney</option></select>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-fire-extinguisher"></i> Fire NOC</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cFireNOC','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cFireNOC','Yes')">Yes</button>
                  </div>
                  <input type="hidden" id="cFireNOC" value="No"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-file-circle-check"></i> Occupancy Certificate</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cOC','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cOC','Yes')">Yes</button>
                  </div>
                  <input type="hidden" id="cOC" value="No"/>
                </div>
              </div>

              <hr class="comm-divider"/>
              <div class="comm-section-head"><i class="fa-solid fa-building-shield"></i> Building Facilities</div>
              <div class="comm-field-row">
                <div class="comm-field">
                  <label><i class="fa-solid fa-shield-halved"></i> Security</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cSecurity','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cSecurity','Yes')">Yes</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cSecurity','24x7')">24x7</button>
                  </div>
                  <input type="hidden" id="cSecurity" value="No"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-video"></i> CCTV</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cCCTV','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cCCTV','Yes')">Yes</button>
                  </div>
                  <input type="hidden" id="cCCTV" value="No"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-car"></i> Parking</label>
                  <div class="comm-toggle">
                    <button type="button" class="comm-toggle-btn active" onclick="commToggle(this,'cParking','No')">No</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cParking','Open')">Open</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cParking','Covered')">Covered</button>
                    <button type="button" class="comm-toggle-btn" onclick="commToggle(this,'cParking','Both')">Both</button>
                  </div>
                  <input type="hidden" id="cParking" value="No"/>
                </div>
              </div>

              <hr class="comm-divider"/>
              <div class="comm-section-head"><i class="fa-solid fa-circle-info"></i> Extra Details</div>
              <div class="comm-field-row">
                <div class="comm-field">
                  <label><i class="fa-solid fa-calendar-check"></i> Available From</label>
                  <input type="date" id="cAvailableFrom"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-compass"></i> Facing</label>
                  <select id="cFacing"><option value="">Select</option><option>East</option><option>West</option><option>North</option><option>South</option><option>North-East</option><option>North-West</option><option>South-East</option><option>South-West</option></select>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-bullseye"></i> Suitable For</label>
                  <input type="text" id="cSuitableFor" placeholder="e.g. IT Office / Startup / Corporate"/>
                </div>
              </div>

            </div>

'''

new_pricing = '''            <!-- Commercial Pricing Fields -->
            <div id="commercialPricing" style="display:none">
              <div class="comm-section-head"><i class="fa-solid fa-indian-rupee-sign"></i> Commercial Pricing Details</div>
              <div class="comm-field-row">
                <div class="comm-field">
                  <label><i class="fa-solid fa-coins"></i> Maintenance (per month)</label>
                  <input type="number" id="cMaintenance" placeholder="e.g. 5000"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-file-invoice"></i> AMC Charges</label>
                  <input type="text" id="cAMC" placeholder="e.g. 12000/year"/>
                </div>
                <div class="comm-field">
                  <label><i class="fa-solid fa-receipt"></i> Property Tax</label>
                  <input type="text" id="cTax" placeholder="e.g. Included / 8000/year"/>
                </div>
              </div>
            </div>

'''

# lines are 1-indexed in our earlier output
# commercialFields: lines 610-907 => 0-indexed 609-906
# blank line 908 => 0-indexed 907
# commercialPricing: lines 909-928 => 0-indexed 908-927
result = lines[:609] + [new_comm] + lines[907:908] + [new_pricing] + lines[928:]
open('c:/Users/meetd/Downloads/City Real Space/admin/index.html', 'w', encoding='utf-8').writelines(result)
print('done', len(result), 'lines')
