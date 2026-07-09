/**
 * Catalog brochure specs mapped to teknomed-web product slugs.
 *
 * Source: C:\Users\warma\Documents\brosur-lin\catalog-new\src\data\specs.json
 * (31 products extracted from XLSX:Table 1 — SPESIFIKASI MOT ELFATECH MA7 MAYOR PIR)
 *
 * Section A → slug "mot" (Modular Operating Theatre)
 * Section B → slug "hvac-cleanroom" (HVAC System)
 * Section C → slug "mgps" (Medical Gas Pipeline System)
 */

export interface CatalogSpecItem {
  label: string
  value: string
}

export interface CatalogSpecGroup {
  /** Display title for this spec group (e.g. "Rg. OK — Dinding Sandwich") */
  title: string
  /** Individual spec lines; label may be empty for value-only entries */
  items: CatalogSpecItem[]
  /** Optional quantity + unit from the source spreadsheet */
  quantity?: number
  unit?: string
}

/** Full catalog engineering data keyed by product slug. */
export const CATALOG_SPECS: Record<string, CatalogSpecGroup[]> = {
  // ─── MOT — Section A: Paket MOT (Modular Operating Theatre) ────────────
  mot: [
    {
      title: 'Dinding Pabrikasi',
      items: [
        { label: '', value: 'Dinding Sandwich' },
        { label: '', value: 'Wall medical insulated panel PIR, t. 75 mm, HRP Antibacterial 0,5mm' },
        { label: '', value: 'Picture wall 1 sisi temper glass covered 12mm' },
      ],
    },
    {
      title: 'Ceiling Sandwich (PIR)',
      items: [
        { label: '', value: 'Wall medical insulated panel PIR, t. 75 mm, HRP Antibacterial 0,5mm + Rangka' },
      ],
      quantity: 1,
      unit: 'ls',
    },
    {
      title: 'Power Socket Box',
      items: [],
      quantity: 1,
      unit: 'set',
    },
    {
      title: 'Material Support',
      items: [],
      quantity: 1,
      unit: 'ls',
    },
    {
      title: 'Pb 2mm pada dinding, t 3 mtr',
      items: [],
      quantity: 1,
      unit: 'ls',
    },
    {
      title: 'Pass Box Stainless Steel SUS-304',
      items: [
        { label: 'Material', value: 'SUS 304' },
        { label: 'Outside Dimension', value: '800 x 800 x 500 mm' },
        { label: 'Inside Dimension', value: '500 x 500 x 600 mm' },
        {
          label: 'Advantages',
          value:
            'UV Lamp Included, With Timer Activation, Not Only Interlock System, Can Custom Size, Two Side Open Inter-Lock Door',
        },
        {
          label: 'Items',
          value:
            'Switch Z 56 QB, Seal, Handle, Clear Glass 12 mm, Hinge, PLC Interlock System, Lights LED 220 V, Electrical, Magnetic Interlock, Timer Activation, Lights UV',
        },
      ],
      quantity: 1,
      unit: 'Bh',
    },
    {
      title: 'X-Ray Viewer',
      items: [
        { label: 'Screen', value: 'Double Screen' },
        { label: 'Dimensions (W.H.D)', value: '880 x 503 x 29 mm' },
        { label: 'Frame (W.H.D)', value: '736 x 440 mm' },
        { label: 'Power Consumption', value: '30 W' },
        { label: 'Light Source', value: 'LED' },
        { label: 'Power Supply Input', value: 'AC 100-240 V 50/60 Hz' },
        { label: 'Brightness (LUX)', value: '> 10.00' },
        { label: 'Net Weight', value: '8.8 Kg' },
        { label: 'Color Temperature', value: '5,900 - 9,000 K' },
        { label: 'Luminance Adjustment', value: '20% - 100%' },
      ],
      quantity: 1,
      unit: 'Bh',
    },
    {
      title: 'Scrub Sink 2 Bay',
      items: [
        { label: '', value: 'Material SUS 304 Thickness 1.2 mm' },
        { label: '', value: 'Available in 1, 2 and 3 Washing Station' },
        { label: '', value: 'Dimension 1600 x 600 x 1550 mm / Custom Size' },
        { label: '', value: 'Water Heater — Included (Integrated System)' },
        { label: '', value: 'Automatic Sensor System & Manual System for Emergency Use' },
        { label: '', value: 'Sterilized Ultraviolet Lamp System' },
        { label: '', value: 'Filtering System for 5 Micron (customizable)' },
        { label: '', value: '2 Bay Faucet Automatic System & 2 Foot System for Manual Use' },
        { label: '', value: 'Safety System Electricity to Avoid Leakage' },
        { label: '', value: 'Low Cost Electricity Consumption, AC 220 V, 50 Hz, 250 W' },
      ],
      quantity: 1,
      unit: 'Bh',
    },
    {
      title: 'Hermetic Auto Sliding Door',
      items: [
        { label: '', value: 'Made of Stainless Steel' },
        { label: '', value: 'Glass Cell: 5 mm Thick' },
        { label: '', value: 'Electric Motors' },
        { label: '', value: 'Battery Backup' },
        { label: '', value: 'Dimension 1600 x 2100 mm' },
        { label: '', value: 'Voltage: 220 VAC, 50/60 Hz' },
        { label: '', value: 'Labor Assistant Switch (Foot Switch)' },
        { label: '', value: 'Sensor Mounted Inside & Outside the Operating Room' },
        { label: '', value: 'Speed: 0.7 m/sec (1 leaf), 1.4 m/sec (2 leaf)' },
        { label: '', value: 'Power Auto Volt 85-264 VAC' },
        { label: '', value: 'Automatic Motor Reversal When Obstacles Detected, Including Safety Lights' },
        { label: '', value: 'Lapis Pb 2mm dan Glass Pb' },
      ],
      quantity: 1,
      unit: 'Unit',
    },
    {
      title: 'Automatic Swing PB/Lead Door',
      items: [
        { label: '', value: 'Dimension Size: 1000 x 2200 mm' },
        { label: '', value: 'Insulation: PB Lead (Plywood 9 mm + Rangka Hollow) + Insulation PIR' },
        { label: '', value: 'View Glass Timbal' },
        { label: '', value: 'With Mortise X-Ray Special (Developed by LBA)' },
        { label: '', value: 'PB Glass: View Glass Timbal' },
        { label: '', value: 'Material Frame: Steel Plate 1.5–2 mm / Stainless Steel' },
        { label: '', value: 'Material Door Leaf: Steel Plate 1.2–1.5 mm / Stainless Steel' },
        { label: '', value: 'Door Leaf Thickness: ±45–50 mm' },
        { label: '', value: 'Finish: Powder Coating Color / Stainless Steel' },
        { label: '', value: 'Accessories: Onassis, Wilka, Calvis, Griff, Dekson, Kend, etc.' },
      ],
      quantity: 1,
      unit: 'Unit',
    },
    {
      title: 'Lampu Penerangan LED Ruangan',
      items: [
        { label: '', value: 'LED Panel IP20/40–45 W, uk: 297 (w) x 1195 (l) x 10 (t) mm' },
      ],
      quantity: 12,
      unit: 'Unit',
    },
    {
      title: 'Vinyl Lantai',
      items: [
        { label: '', value: 'Anti bakteri, anti jamur, anti betadine, anti eosin, antistatic' },
        { label: '', value: 'Include leveling' },
        { label: '', value: 'Plint lantai bahan aluminium (caping + cove) OK' },
      ],
      quantity: 1,
      unit: 'set',
    },
    {
      title: 'Surgical Control Panel Room Touchscreen',
      items: [
        { label: '', value: 'System Windows Smart Control Panel Room' },
        { label: '', value: 'Programming Modbus TCP/IP' },
        { label: '', value: 'Switch Hub' },
        { label: '', value: 'Panel Listrik System — Control Room & Display Operating Timer' },
      ],
      quantity: 1,
      unit: 'Unit',
    },
    {
      title: 'HFP-SS90/160 Mechanical Double Arm Rotating Crane Surgical Pendant',
      items: [
        { label: 'Left Area', value: 'Right Area' },
        { label: 'Power Socket', value: '6 pcs (each side)' },
        { label: 'Oxygen Gas Terminal', value: '1 pcs (each side)' },
        { label: 'Vacuum Gas Terminal', value: '1 pcs (each side)' },
        { label: 'Network Socket', value: '1 pcs (each side)' },
        { label: 'Equipotential Sockets', value: '2 pcs (each side)' },
        { label: 'Platform', value: '1 pcs (each side)' },
        { label: 'Platform With Drawer', value: '1 pcs (each side)' },
        { label: 'Infusion Stand', value: '1 pcs (each side)' },
        { label: 'Arm Rotating Radius', value: '800 mm + 800 mm' },
        { label: 'Arm Rotating Angle', value: '340°' },
        { label: 'Braking System', value: 'Friction Brake' },
        { label: 'Maximum Load Capacity', value: '120 kg' },
        { label: 'Medical Air Terminal Units', value: '2' },
        { label: 'Sockets', value: '6 China Type 3 Pin 10A' },
        { label: 'Earth Studs', value: '2' },
        { label: 'Equipment Shelves', value: '2' },
        { label: 'Drawer', value: '1' },
        { label: 'IV Pole & Infusion Pump Rack', value: '1' },
        { label: 'Network Connect', value: '1 pc' },
        { label: 'Phone Connect', value: '1 pc' },
        { label: 'NET Load of Pendant', value: '80 kg' },
      ],
      quantity: 1,
      unit: 'unit',
    },
    {
      title: '700/700 Shadowless Lamp',
      items: [
        { label: 'Illuminance', value: '≥160,000 Lux' },
        { label: 'Colour Temperature', value: '3800±500 K, 4400±500 K, 5000±500 K' },
        { label: 'Color Reduction Index (Ra)', value: '93' },
        { label: 'Total Irradiance', value: '544 W/m², 534 W/m²' },
        { label: 'Size of Light Field', value: '250–300 mm' },
        { label: 'Service Life of Illuminant', value: '50,000 h' },
        { label: 'Power Supply Voltage', value: 'AC 110–240 V 50/60 Hz' },
        { label: 'Best Height of Installation', value: '2900 mm' },
        { label: 'Total Power Consumption', value: '80 W' },
        { label: 'Total LED Bulb Quantity', value: '218 pcs (18×6 + 18×6)' },
        { label: 'Endo', value: 'Yes' },
      ],
      quantity: 1,
      unit: 'unit',
    },
    {
      title: 'Operating Table HFEOT99X',
      items: [
        { label: 'Length × Width (Tabletop)', value: '2100 / 550 mm' },
        { label: 'Elevation (Down/Up)', value: '710 / 1010 mm' },
        { label: 'Trendelenburg / Reverse', value: '25° / 25°' },
        { label: 'Lateral Tilt (Left/Right)', value: '15° / 15°' },
        { label: 'Head Rest (Up/Down)', value: '40° / 90°' },
        { label: 'Footplate (Up/Down & Horizontal)', value: '90° / 90° / 15°' },
        { label: 'Back Plate (Up/Down)', value: '85° / 20°' },
        { label: 'Kidney Bridge', value: '110 mm' },
        { label: 'Longitudinal Sliding', value: '350 mm' },
        { label: 'Power', value: '220 V 50 Hz 1.0 kW' },
      ],
      quantity: 1,
      unit: 'unit',
    },
    {
      title: 'OHMEDA Gas Outlets',
      items: [
        { label: 'Oxygen', value: 'Green' },
        { label: 'Air 4 Bar', value: 'Yellow' },
        { label: 'Vacuum', value: 'White' },
        { label: 'N2O', value: 'Blue' },
        { label: 'CO2', value: 'Grey' },
        { label: 'AGSS', value: 'Purple' },
      ],
      quantity: 1,
      unit: 'set',
    },
    {
      title: 'Lampu Indikator Ruang OK',
      items: [],
      quantity: 1,
      unit: 'bh',
    },
    {
      title: 'Speaker Aktif',
      items: [],
      quantity: 2,
      unit: 'bh',
    },
    {
      title: 'PACS Cabinet',
      items: [
        { label: 'Material', value: 'Stainless Steel' },
        { label: 'Dimension', value: '1200 x 2000 x 400 mm' },
      ],
    },
  ],

  // ─── HVAC & Cleanroom — Section B: Pekerjaan HVAC System ────────────────
  'hvac-cleanroom': [
    {
      title: 'AHU Double Skin',
      items: [
        { label: 'Size', value: '1200 x 3000 x 930 mm' },
        { label: 'Material Bodi', value: 'Double skin AHU 25 mm' },
        { label: '', value: 'Aluminium profile alloy T25 mm' },
        { label: 'Booster Fan', value: 'Capacity ±3000 CFM' },
        { label: '', value: 'Pressure 1000 Pa' },
        { label: 'Heater', value: 'Power 4500 W (750 W × 6)' },
        { label: '', value: 'Material tube SS304' },
        { label: '', value: 'Material finned SS304' },
        { label: 'Magneheic Control', value: 'Range 0–500 Pa' },
        { label: 'UV-C Ultraviolet', value: 'Philips lamp, 30–72 W' },
        { label: 'Pre-filter', value: 'G4 washable/disposable, 30–65%, size 24″ × 24″ × 2″' },
        { label: 'Medium Filter', value: 'F8/F9, 90–95%, size 24″ × 24″ × 12″' },
        { label: 'Coil Evaporator', value: '10 HP, 100,000 BTU/h, air flow rate 3000 CFM' },
        { label: '', value: 'Refrigerant R410, fins material aluminium' },
        { label: 'Outdoor Unit', value: 'DAIKIN, 12 HP, 120,000 BTU/h' },
      ],
      quantity: 1,
      unit: 'unit',
    },
    {
      title: 'Ducting (Supply, Return & Plenum) ±100 m²',
      items: [
        { label: 'Material', value: 'Polyurethane (PIU), TDI, thickness 20 mm' },
        { label: '', value: 'Accessories' },
        { label: 'Perforated Grill', value: 'Galvanised steel, powder coating white' },
        { label: 'Volume Damper', value: 'Mild steel, powder coating' },
      ],
      quantity: 1,
      unit: 'lot',
    },
    {
      title: 'Laminar Air Flow',
      items: [
        { label: 'Material', value: 'Galvanised steel, powder coating' },
        { label: '', value: 'Type perforated' },
        { label: 'Final Filter HEPA', value: 'H14, 0.9999 efficiency, size 24″ × 48″ × 3″' },
      ],
      quantity: 1,
      unit: 'unit',
    },
    {
      title: 'Control Panel AHU',
      items: [
        { label: 'Material', value: 'Box panel 900 × 600 × 250' },
        { label: '', value: 'Programming (PLC)' },
        { label: '', value: 'Relay (Omron)' },
        { label: '', value: 'Noise filter' },
        { label: '', value: 'Switch hub 5 port' },
        { label: '', value: 'Power supply 24 V' },
        { label: '', value: 'MCB' },
        { label: '', value: 'MCCB' },
        { label: '', value: 'Contactor control (LS)' },
        { label: '', value: 'Lamp RST' },
        { label: '', value: 'HMI control panel system 7″' },
      ],
      quantity: 1,
      unit: 'unit',
    },
    {
      title: 'Piping Pipa',
      items: [
        { label: '', value: 'Pipa refrigerant' },
        { label: '', value: 'ASTM B280' },
        { label: '', value: 'Isolasi Harmaflek' },
        { label: '', value: 'Drain pipa' },
      ],
      quantity: 1,
      unit: 'lot',
    },
    {
      title: 'Pekerjaan Listrik',
      items: [
        { label: '', value: 'Kabel Power (unit AC, outdoor AC) NYY' },
        { label: '', value: 'Kabel kontrol NYA' },
        { label: '', value: 'Kabel Feeder' },
        { label: '', value: 'Grounding' },
      ],
      quantity: 1,
      unit: 'ls',
    },
    {
      title: 'Konstruksi Unit Indoor & Outdoor',
      items: [],
      quantity: 1,
      unit: 'Ls',
    },
  ],

  // ─── MGPS — Section C: Pekerjaan Gas Medic ──────────────────────────────
  mgps: [
    {
      title: 'Peralatan Utama — LED Automatic Manifold',
      items: [
        { label: 'Input Power', value: '110 V to 240 V, 50 Hz to 60 Hz' },
        { label: 'Max Input Pressure', value: '200 bar' },
        { label: 'Output Pressure', value: '0–12 bar (Adjustable)' },
        { label: 'Switching Pressure', value: '6–10 bar (Adjustable)' },
        { label: 'Applicable Gas', value: 'O₂, Air, CO₂, N₂, and N₂O' },
        { label: 'Max Flow', value: '100 m³/h (Customizable)' },
        { label: 'Inlet Connection', value: '½″ (Customizable)' },
        { label: 'Outlet Connection', value: '22 mm (Customizable)' },
        { label: 'Dimensions', value: '600 × 500 × 200 mm' },
      ],
      quantity: 1,
      unit: 'set',
    },
    {
      title: 'Safety Valve Opening Pressure',
      items: [
        { label: 'Primary Pressure Reducer', value: '18 bar' },
        { label: 'Secondary Pressure Reducer', value: '10 bar' },
      ],
    },
    {
      title: 'Alarm System & Remote Alarming',
      items: [
        { label: '', value: 'Input: 15 MPa, output: 200 m³/h, 0.4–0.8 MPa' },
        { label: '', value: '100% pressure test, safe and reliable' },
      ],
    },
    {
      title: 'LED Alarm Gas',
      items: [
        { label: 'Input Power', value: '110 VAC to 240 VAC, 50 Hz to 60 Hz' },
        { label: 'Pressure Range', value: '-0.1 ~ 1.0 MPa' },
        { label: 'LED Size', value: '0.8 Inch' },
        { label: 'Accuracy', value: '±1.5%' },
        { label: 'Applicable Gas', value: 'O₂, Air, Vac, N₂ and N₂O, etc.' },
        { label: 'Installation Type', value: 'Wall-Mounted or Embedded in The Wall' },
      ],
    },
    {
      title: 'Zone Box Valve 5 Gas',
      items: [
        { label: 'Model', value: 'ZV-XXXXX' },
        { label: 'Gas Point', value: '5-GAS' },
        { label: 'Dimensions', value: '450 × 775 × 103 mm' },
        { label: '', value: 'NFPA / ISO full color standard' },
        { label: 'Applicable Gas', value: 'O₂, Air, Vac, CO₂, N₂, and N₂O, etc.' },
        { label: '', value: 'Dome loaded regulator' },
        { label: '', value: 'Removable acrylic observation window' },
        { label: '', value: 'Pull-out with ring' },
        { label: '', value: 'Stainless steel pressure gauge shows gas pressure' },
        { label: 'Valve Size', value: '½″ to 2-½″' },
        { label: '', value: 'Wall-mounted or embedded in the wall' },
      ],
    },
    {
      title: 'Header O₂',
      items: [],
    },
    {
      title: 'Pemipaan Gas Medis (O₂, CO₂, Vacuum, Air Compress, N₂O)',
      items: [
        { label: '', value: 'Pipa Tembaga Gas Medis ASTM B-819 ½″' },
        { label: '', value: 'Pipa Tembaga Gas Medis ASTM B-819 1⅛″' },
        { label: '', value: 'Pipa Tembaga Gas Medis ASTM B-819 ¾″' },
        { label: '', value: 'Fittings' },
      ],
      quantity: 1,
      unit: 'set',
    },
  ],

  // ─── HVAC & Cleanroom — Section B ─────────────────────────────────────
  'hvac-cleanroom': [
    {
      title: 'AHU Double Skin',
      items: [
        { label: '', value: 'Air Handling Unit double skin, casing PU 50mm' },
        { label: '', value: 'Filter F7 + H13 HEPA' },
        { label: '', value: 'Cooling coil Cu/Al 6 row' },
        { label: '', value: 'Supply + return fan plug type' },
      ],
      quantity: 1,
      unit: 'set',
    },
    {
      title: 'Ducting',
      items: [
        { label: '', value: 'Galvanized steel ducting, ketebalan sesuai ukuran' },
        { label: '', value: 'Volume damper + balancing' },
        { label: '', value: 'Diffuser HEPA terminal ceiling' },
        { label: '', value: 'Return air grille' },
      ],
      quantity: 1,
      unit: 'set',
    },
    {
      title: 'Laminar Air Flow (LAF)',
      items: [
        { label: '', value: 'Ceiling mounted LAF unit' },
        { label: '', value: 'HEPA filter H14' },
        { label: '', value: 'Pre-filter G4 + F7' },
        { label: '', value: 'Diffuser panel stainless steel' },
      ],
      quantity: 1,
      unit: 'unit',
    },
    {
      title: 'Control Panel',
      items: [
        { label: '', value: 'PLC based HVAC control panel' },
        { label: '', value: 'Temperature + humidity sensor' },
        { label: '', value: 'Differential pressure sensor' },
        { label: '', value: 'BMS integration ready' },
      ],
      quantity: 1,
      unit: 'set',
    },
    {
      title: 'Piping',
      items: [
        { label: '', value: 'Chilled water piping (supply + return)' },
        { label: '', value: 'Condensate drain piping' },
        { label: '', value: 'Insulation Armaflex' },
      ],
      quantity: 1,
      unit: 'lot',
    },
    {
      title: 'Electrical Work',
      items: [
        { label: '', value: 'Power cable + distribution' },
        { label: '', value: 'Control wiring + cable tray' },
        { label: '', value: 'Earthing + bonding' },
      ],
      quantity: 1,
      unit: 'lot',
    },
    {
      title: 'Indoor/Outdoor Construction',
      items: [
        { label: '', value: 'Outdoor unit pad + fencing' },
        { label: '', value: 'Indoor cable tray + conduit' },
        { label: '', value: 'Wall/ceiling penetrations + sealing' },
      ],
      quantity: 1,
      unit: 'lot',
    },
  ],
}

/**
 * Get catalog spec groups for a given product slug.
 * Returns undefined if the product has no catalog data.
 */
export function getCatalogSpecs(slug: string): CatalogSpecGroup[] | undefined {
  return CATALOG_SPECS[slug]
}
