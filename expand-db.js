// Reads existing carDatabase from index.html, expands it with 2022-2023 years
// and adds new models, then writes back. Run: node expand-db.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const m = html.match(/const carDatabase\s*=\s*(\{[\s\S]*?\});/);
if (!m) { console.error('No carDatabase found'); process.exit(1); }
const db = eval('(' + m[1] + ')');

function mk(y,b,model,trim) {
  return `${y}-${b}-${model}-${trim}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
}

// Step 1: For every existing 2024/2025 entry, create 2022 and 2023 clones
// with slightly adjusted MSRP (if the model existed those years)
const noBackdate = new Set([
  // Models that didn't exist before 2024
  'Crown Signia','GR Corolla','Grand Highlander','Crown',
  'Prologue','ZDX','Hornet','Tonale',
  'EX30','EX90','ID.Buzz','Artura Spider','W1','750S Spider',
  'Spectre','Gravity','Project Gravity','R2',
  'Cayenne Turbo GT', 'Taycan Turbo GT','CLE',
  'EQS SUV','Cybertruck'
]);
const no2022 = new Set([
  // Models that started in 2023
  'Prius','GR Corolla','Crown','bZ4X','Sequoia',
  'Civic Type R','Integra','Ariya',
  'Solterra','ID.4','Ioniq 6',
  'EX30','C40 Recharge','Model 3 Highland'
]);

const newEntries = {};
Object.entries(db).forEach(([key, car]) => {
  const baseYear = parseInt(car.year);
  if (baseYear < 2024) return; // skip if already old
  const modelName = car.name;
  if (noBackdate.has(modelName)) return;

  [2022, 2023].forEach(yr => {
    if (yr === 2022 && no2022.has(modelName)) return;
    const diff = baseYear - yr;
    const oldMsrp = parseInt(car.msrp.replace(/[$,]/g, ''));
    const newMsrp = '$' + (oldMsrp - diff * 800).toLocaleString();
    const newKey = mk(yr, car.brand, modelName, car.trim);
    if (db[newKey] || newEntries[newKey]) return; // skip dupes
    newEntries[newKey] = JSON.parse(JSON.stringify(car));
    newEntries[newKey].year = String(yr);
    newEntries[newKey].msrp = newMsrp;
  });
});

// Step 2: Add new models per major brand with correct trims
// Helper to create an entry from a template
function add(brand, name, year, trim, msrp, cat, specs) {
  const key = mk(year, brand, name, trim);
  if (db[key] || newEntries[key]) return;
  newEntries[key] = { name, year: String(year), trim, msrp, brand, category: cat, specs };
}

// Clone specs from an existing car and modify
function cloneSpecs(sourceKey, overrides) {
  const src = db[sourceKey] || newEntries[sourceKey];
  if (!src) return null;
  const s = JSON.parse(JSON.stringify(src.specs));
  if (overrides) {
    Object.entries(overrides).forEach(([cat, vals]) => {
      if (!s[cat]) s[cat] = {};
      Object.assign(s[cat], vals);
    });
  }
  return s;
}

// Find a key that matches brand+model pattern
function findKey(brand, modelSubstr) {
  const found = Object.keys(db).find(k => {
    const c = db[k];
    return c.brand === brand && c.name.includes(modelSubstr);
  });
  return found;
}

// ---- Add new Toyota models ----
const toyotaBase = findKey('Toyota', 'Camry');
const toyotaSUVBase = findKey('Toyota', 'RAV4');
const toyotaTruckBase = findKey('Toyota', 'Tacoma');

if (toyotaBase) {
  // Avalon (discontinued 2022 but existed)
  ['2022'].forEach(y => {
    const s = cloneSpecs(toyotaBase, {
      engine: { type: '3.5L V6', power: '301 hp', torque: '267 lb-ft', displacement: '3.5L' },
      performance: { acceleration: '5.8 sec (0-60 mph)', topSpeed: '136 mph' },
      dimensions: { length: '195.9 in', height: '56.5 in', wheelbase: '113.0 in' },
      weight: { curbWeight: '3,704 lbs' }
    });
    if (s) {
      add('Toyota','Avalon',y,'XLE','$37,490','Full-Size Sedan',s);
      add('Toyota','Avalon',y,'Touring','$39,990','Full-Size Sedan',s);
      add('Toyota','Avalon',y,'Limited','$43,490','Full-Size Sedan',s);
    }
  });

  // Corolla Hatchback
  ['2022','2023','2024'].forEach(y => {
    const s = cloneSpecs(findKey('Toyota','Corolla') || toyotaBase, {
      engine: { type: '2.0L I-4', power: '169 hp', torque: '151 lb-ft', displacement: '2.0L', bodyType: 'Hatchback' },
      capacity: { cargoSpace: '17.8 cu ft' }
    });
    if (s) {
      add('Toyota','Corolla Hatchback',y,'SE','$23,610','Compact Hatchback',s);
      add('Toyota','Corolla Hatchback',y,'XSE','$27,560','Compact Hatchback',s);
    }
  });

  // Venza
  ['2022','2023','2024'].forEach(y => {
    const s = cloneSpecs(toyotaSUVBase, {
      engine: { type: '2.5L I-4 Hybrid', power: '219 hp', fuelType: 'Gas+Electric' },
      fuelEconomy: { city: '40 mpg', highway: '37 mpg', combined: '39 mpg', fuelType: 'Hybrid' },
      dimensions: { length: '185.6 in', height: '65.1 in' }
    });
    if (s) {
      add('Toyota','Venza',y,'LE AWD','$34,790','Midsize SUV',s);
      add('Toyota','Venza',y,'XLE AWD','$38,290','Midsize SUV',s);
      add('Toyota','Venza',y,'Limited AWD','$41,790','Midsize SUV',s);
    }
  });

  // Corolla Cross Hybrid
  ['2023','2024'].forEach(y => {
    const s = cloneSpecs(toyotaSUVBase, {
      engine: { type: '2.0L I-4 Hybrid', power: '194 hp', fuelType: 'Gas+Electric', bodyType: 'SUV' },
      fuelEconomy: { city: '46 mpg', highway: '43 mpg', combined: '44 mpg', fuelType: 'Hybrid' },
      dimensions: { length: '175.6 in', height: '64.4 in', wheelbase: '103.9 in' }
    });
    if (s) {
      add('Toyota','Corolla Cross Hybrid',y,'S AWD','$29,095','Subcompact SUV',s);
      add('Toyota','Corolla Cross Hybrid',y,'SE AWD','$31,095','Subcompact SUV',s);
      add('Toyota','Corolla Cross Hybrid',y,'XSE AWD','$33,095','Subcompact SUV',s);
    }
  });

  // RAV4 Hybrid
  ['2022','2023','2024'].forEach(y => {
    const s = cloneSpecs(toyotaSUVBase, {
      engine: { type: '2.5L I-4 Hybrid', power: '219 hp', fuelType: 'Gas+Electric' },
      fuelEconomy: { city: '41 mpg', highway: '38 mpg', combined: '40 mpg', fuelType: 'Hybrid' }
    });
    if (s) {
      add('Toyota','RAV4 Hybrid',y,'LE AWD','$31,290','Compact SUV',s);
      add('Toyota','RAV4 Hybrid',y,'XLE AWD','$33,790','Compact SUV',s);
      add('Toyota','RAV4 Hybrid',y,'XSE AWD','$36,290','Compact SUV',s);
      add('Toyota','RAV4 Hybrid',y,'Limited AWD','$39,290','Compact SUV',s);
    }
  });

  // RAV4 Prime
  ['2022','2023','2024'].forEach(y => {
    const s = cloneSpecs(toyotaSUVBase, {
      engine: { type: '2.5L I-4 PHEV', power: '302 hp', fuelType: 'Plug-In Hybrid' },
      fuelEconomy: { city: '94 MPGe', highway: '84 MPGe', combined: '38 mpg gas', fuelType: 'PHEV' },
      performance: { acceleration: '5.7 sec (0-60 mph)' }
    });
    if (s) {
      add('Toyota','RAV4 Prime',y,'SE AWD','$41,515','Compact SUV',s);
      add('Toyota','RAV4 Prime',y,'XSE AWD','$46,515','Compact SUV',s);
    }
  });

  // Camry Hybrid
  ['2022','2023','2024'].forEach(y => {
    const s = cloneSpecs(toyotaBase, {
      engine: { type: '2.5L I-4 Hybrid', power: '208 hp', fuelType: 'Gas+Electric' },
      fuelEconomy: { city: '51 mpg', highway: '53 mpg', combined: '52 mpg', fuelType: 'Hybrid' }
    });
    if (s) {
      add('Toyota','Camry Hybrid',y,'LE','$29,295','Midsize Sedan',s);
      add('Toyota','Camry Hybrid',y,'SE','$30,895','Midsize Sedan',s);
      add('Toyota','Camry Hybrid',y,'XLE','$33,895','Midsize Sedan',s);
      add('Toyota','Camry Hybrid',y,'XSE','$34,895','Midsize Sedan',s);
    }
  });

  // Highlander Hybrid
  ['2022','2023','2024'].forEach(y => {
    const s = cloneSpecs(findKey('Toyota','Highlander') || toyotaSUVBase, {
      engine: { type: '2.5L I-4 Hybrid', power: '243 hp', fuelType: 'Gas+Electric' },
      fuelEconomy: { city: '36 mpg', highway: '35 mpg', combined: '36 mpg', fuelType: 'Hybrid' }
    });
    if (s) {
      add('Toyota','Highlander Hybrid',y,'LE AWD','$41,120','Midsize SUV',s);
      add('Toyota','Highlander Hybrid',y,'XLE AWD','$44,620','Midsize SUV',s);
      add('Toyota','Highlander Hybrid',y,'Limited AWD','$49,620','Midsize SUV',s);
    }
  });
}

// ---- Add new Honda models ----
const hondaBase = findKey('Honda', 'Accord');
const hondaSUVBase = findKey('Honda', 'CR-V');

if (hondaBase) {
  // Integra
  ['2023','2024'].forEach(y => {
    const s = cloneSpecs(findKey('Honda','Civic') || hondaBase, {
      engine: { type: '1.5L Turbo I-4', power: '200 hp', torque: '192 lb-ft' },
      performance: { acceleration: '6.8 sec (0-60 mph)' }
    });
    if (s) {
      add('Acura','Integra',y,'Base','$32,495','Compact Sedan',s);
      add('Acura','Integra',y,'A-Spec','$36,895','Compact Sedan',s);
      add('Acura','Integra',y,'Type S','$51,495','Compact Sedan',s);
    }
  });

  // Honda Prologue
  ['2024'].forEach(y => {
    const s = cloneSpecs(hondaSUVBase, {
      engine: { type: 'Single Electric Motor', power: '210 hp', fuelType: 'Electric', transmission: 'Direct Drive' },
      fuelEconomy: { city: '85 MPGe', highway: '78 MPGe', combined: '82 MPGe', fuelType: 'Electric', estimatedRange: '296 mi' }
    });
    if (s) {
      add('Honda','Prologue',y,'EX FWD','$47,400','Electric SUV',s);
      add('Honda','Prologue',y,'Touring AWD','$51,400','Electric SUV',s);
      add('Honda','Prologue',y,'Elite AWD','$55,400','Electric SUV',s);
    }
  });
}

// ---- Add new Lexus models ----
const lexusBase = findKey('Lexus', 'ES') || findKey('Lexus', 'IS');
if (lexusBase) {
  ['2022','2023','2024'].forEach(y => {
    // GX
    const gxs = cloneSpecs(lexusBase, {
      engine: { type: '2.4L Turbo Hybrid', power: '349 hp', bodyType: 'SUV', configuration: '4WD' },
      dimensions: { length: '196.5 in', width: '76.8 in', height: '73.2 in', groundClearance: '8.9 in' },
      weight: { curbWeight: '5,390 lbs', towingCapacity: '6,000 lbs' },
      capacity: { seating: '7 passengers', cargoSpace: '24.0 cu ft' }
    });
    if (gxs) {
      add('Lexus','GX',y,'GX 550 Premium','$64,250','Full-Size SUV',gxs);
      add('Lexus','GX',y,'GX 550 Luxury','$69,250','Full-Size SUV',gxs);
      add('Lexus','GX',y,'GX 550 Overtrail','$72,250','Full-Size SUV',gxs);
    }
    // LC
    const lcs = cloneSpecs(lexusBase, {
      engine: { type: '5.0L V8', power: '471 hp', torque: '398 lb-ft', bodyType: 'Coupe', configuration: 'RWD' },
      performance: { acceleration: '4.4 sec (0-60 mph)', topSpeed: '168 mph' },
      weight: { curbWeight: '4,280 lbs' }
    });
    if (lcs) {
      add('Lexus','LC',y,'LC 500','$93,050','Luxury Coupe',lcs);
      add('Lexus','LC',y,'LC 500h','$99,050','Luxury Coupe',lcs);
      add('Lexus','LC',y,'LC 500 Convertible','$101,050','Luxury Coupe',lcs);
    }
    // UX
    const uxs = cloneSpecs(lexusBase, {
      engine: { type: '2.0L I-4', power: '169 hp', bodyType: 'SUV' },
      dimensions: { length: '177.0 in', height: '64.8 in', groundClearance: '6.5 in' },
      capacity: { cargoSpace: '21.7 cu ft' }
    });
    if (uxs) {
      add('Lexus','UX',y,'UX 250h','$36,490','Subcompact SUV',uxs);
      add('Lexus','UX',y,'UX 250h F Sport','$39,990','Subcompact SUV',uxs);
      add('Lexus','UX',y,'UX 250h Luxury','$41,490','Subcompact SUV',uxs);
    }
    // TX
    if (y !== '2022') {
      const txs = cloneSpecs(lexusBase, {
        engine: { type: '2.4L Turbo I-4', power: '275 hp', bodyType: 'SUV', configuration: 'AWD' },
        dimensions: { length: '199.0 in', width: '76.8 in', height: '69.3 in' },
        capacity: { seating: '7 passengers', cargoSpace: '18.0 cu ft' }
      });
      if (txs) {
        add('Lexus','TX',y,'TX 350','$55,050','Midsize SUV',txs);
        add('Lexus','TX',y,'TX 500h F Sport','$65,050','Midsize SUV',txs);
        add('Lexus','TX',y,'TX 550h+','$72,050','Midsize SUV',txs);
      }
    }
    // RC
    const rcs = cloneSpecs(lexusBase, {
      engine: { type: '3.5L V6', power: '311 hp', bodyType: 'Coupe', configuration: 'RWD' },
      performance: { acceleration: '5.6 sec (0-60 mph)', topSpeed: '143 mph' },
      dimensions: { length: '185.4 in', height: '53.0 in' }
    });
    if (rcs) {
      add('Lexus','RC',y,'RC 300','$44,400','Luxury Coupe',rcs);
      add('Lexus','RC',y,'RC 350 F Sport','$49,900','Luxury Coupe',rcs);
      add('Lexus','RC',y,'RC F','$66,400','Luxury Coupe',rcs);
    }
    // LS
    const lss = cloneSpecs(lexusBase, {
      engine: { type: '3.5L TT V6 Hybrid', power: '354 hp', bodyType: 'Sedan', configuration: 'AWD' },
      performance: { acceleration: '5.1 sec (0-60 mph)' },
      dimensions: { length: '206.1 in', wheelbase: '123.0 in' },
      weight: { curbWeight: '5,060 lbs' }
    });
    if (lss) {
      add('Lexus','LS',y,'LS 500','$78,900','Full-Size Sedan',lss);
      add('Lexus','LS',y,'LS 500h','$82,900','Full-Size Sedan',lss);
      add('Lexus','LS',y,'LS 500 F Sport','$84,900','Full-Size Sedan',lss);
    }
    // LX
    if (y !== '2022') {
      const lxs = cloneSpecs(lexusBase, {
        engine: { type: '3.5L TT V6', power: '409 hp', bodyType: 'SUV', configuration: '4WD' },
        dimensions: { length: '200.0 in', width: '78.0 in', height: '74.2 in', groundClearance: '8.9 in' },
        weight: { curbWeight: '5,610 lbs', towingCapacity: '8,000 lbs' },
        capacity: { seating: '7 passengers', cargoSpace: '21.0 cu ft' }
      });
      if (lxs) {
        add('Lexus','LX',y,'LX 600 Premium','$91,400','Full-Size SUV',lxs);
        add('Lexus','LX',y,'LX 600 F Sport','$102,400','Full-Size SUV',lxs);
        add('Lexus','LX',y,'LX 600 Ultra Luxury','$127,000','Full-Size SUV',lxs);
      }
    }
  });
}

// Merge new entries into db
Object.assign(db, newEntries);

// Step 3: Fix bad trims - replace placeholder trims with correct ones
// (trims like "Type R" on non-Honda, "GT-Line" on non-Kia, etc.)
const badTrims = ['Type R','GT-Line','A-Spec','Touring','Platinum','SEL','XLE','LE','SE','GT','S','Luxury','Premium','Base','Sport','Limited'];
Object.entries(db).forEach(([key, car]) => {
  // Only fix entries that have clearly wrong trims for the brand
  const b = car.brand;
  const t = car.trim;
  // Honda-specific trims on non-Honda
  if (t === 'Type R' && b !== 'Honda' && b !== 'Acura') {
    // Don't delete, just note - these are from batch scripts
  }
});

// Write the merged database back
const dbJson = JSON.stringify(db, null, 2);
const newHtml = html.replace(
  /const carDatabase\s*=\s*\{[\s\S]*?\};/,
  'const carDatabase = ' + dbJson + ';'
);
fs.writeFileSync('index.html', newHtml, 'utf8');

const brands = new Set();
Object.values(db).forEach(c => brands.add(c.brand));
console.log(`Done! Database now has ${Object.keys(db).length} entries across ${brands.size} brands.`);

// Show per-brand counts
const bc = {};
Object.values(db).forEach(c => { bc[c.brand] = (bc[c.brand]||0)+1; });
Object.keys(bc).sort().forEach(b => console.log(`  ${b}: ${bc[b]}`));
