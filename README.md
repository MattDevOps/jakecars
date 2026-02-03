# CarCompare - Vehicle Specifications Comparison Tool

A comprehensive web application for comparing vehicle specifications across **47 brands** and **413+ vehicles**.

## 🚗 Features

- Compare up to 4 vehicles side-by-side
- Detailed specifications including:
  - Engine & Powertrain
  - Performance metrics
  - Dimensions
  - Weight distribution
  - Capacity
  - Wheels & Tires
  - Features
- Modern blue and white professional design
- Responsive design for all devices
- Easy-to-use dropdown selectors organized by brand

## 📁 Files Included

### Production Files (Deploy These)
- **`index.html`** - Main website file with all data embedded (deploy this!)
- **`expanded-car-database.json`** - Full database (413 vehicles) for reference

### Documentation
- **`README.md`** - This file

## 🚀 Quick Deploy

### Option 1: GitHub Pages (Free)
1. Create a new repository on GitHub
2. Upload `index.html`
3. Go to Settings → Pages → Enable from main branch
4. Your site will be at `https://yourusername.github.io/repo-name/`

### Option 2: Netlify (Free)
1. Go to https://app.netlify.com/drop
2. Drag and drop `index.html`
3. Done! Get instant URL

### Option 3: Vercel (Free)
1. Create `vercel.json` with:
```json
{
  "cleanUrls": true,
  "rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
}
```
2. Deploy via Vercel CLI or GitHub integration

## 🏎️ Brands Included (47 Total)

### Mainstream Brands
Acura, Alfa Romeo, Audi, BMW, Buick, Cadillac, Chevrolet, Chrysler, Dodge, FIAT, Ford, Genesis, GMC, Honda, Hyundai, Infiniti, Jaguar, Jeep, Kia, Land Rover, Lexus, Lincoln, Mazda, Mercedes-Benz, MINI, Mitsubishi, Nissan, Porsche, Ram, Subaru, Toyota, Volkswagen, Volvo

### Electric/New Brands
BYD, Lucid, Polestar, Rivian, Tesla, VinFast

### Luxury/Exotic Brands
Aston Martin, Bentley, Ferrari, Lamborghini, Lotus, Maserati, McLaren, Rolls-Royce

## 📊 Vehicle Categories

- Sedans (Compact, Midsize, Full-Size, Luxury)
- SUVs (Compact, Midsize, Full-Size, Luxury)
- Trucks (Midsize, Full-Size, Heavy-Duty)
- Electric Vehicles (Sedans, SUVs, Trucks)
- Sports Cars & Supercars
- Grand Tourers
- Hypercars
- Minivans

## 🔧 Updating Data

The vehicle data is embedded directly in `index.html` for easy deployment. To update:

1. Edit the `carDatabase` object in `index.html`
2. Or use `expanded-car-database.json` as a reference and rebuild

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Data Sources

Vehicle specifications compiled from:
- Official manufacturer websites
- EPA.gov
- Edmunds
- Car and Driver
- Kelley Blue Book

---

**Note:** Prices and specifications are subject to change. Always verify with official sources before making purchasing decisions.
