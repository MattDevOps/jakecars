# Car Price Update Guide

## Important Note About Wikipedia

**Wikipedia is NOT a reliable source for current car prices** because:
- Most Wikipedia car pages don't include MSRP in the infobox
- Prices change frequently and Wikipedia focuses on technical specs
- Prices vary by region, trim level, and options

## Better Sources for Accurate Car Prices

### Recommended Sources (in order of accuracy):

1. **Manufacturer Websites** (Most Accurate)
   - Official brand websites have the most current MSRP
   - Example: honda.com, toyota.com, tesla.com

2. **Edmunds.com**
   - Comprehensive pricing database
   - Includes MSRP, invoice price, and market value
   - More reliable than Wikipedia

3. **KBB.com (Kelley Blue Book)**
   - Industry standard for car pricing
   - Includes MSRP and market values

4. **Car and Driver / Motor Trend**
   - Review sites with pricing information
   - Usually include MSRP in reviews

5. **Wikipedia** (Last Resort)
   - Only use if other sources unavailable
   - Often outdated or missing

## How to Update Prices

### Option 1: Manual Update (Most Accurate)
1. Open `verified-car-database-expanded.json`
2. For each car, visit the manufacturer website
3. Update the `msrp` field with the correct price
4. Format: `"$XX,XXX"` (e.g., `"$34,045"`)

### Option 2: Wikipedia Scraper (Limited Success)
```bash
python update_prices_wikipedia.py
```
**Note:** This will likely find prices for only a small percentage of cars.

### Option 3: Hybrid Approach
1. Run the Wikipedia scraper to get what it can find
2. Manually verify and update remaining prices from manufacturer sites
3. Focus on the most popular/common models first

## Current Status

The database has **368 cars** across **37 brands**. 

To get accurate prices for all cars, you'll need to:
1. Visit manufacturer websites for each brand
2. Look up each model's MSRP
3. Update the JSON file accordingly

## Scripts Available

- `update_prices_wikipedia.py` - Attempts to scrape Wikipedia (limited success)
- `update_car_prices.py` - Multi-source scraper (Edmunds + Wikipedia)
- `test_price_scraper.py` - Test the scraper on a few cars first

## Recommendation

For a production-quality database, **manually verify prices from manufacturer websites**. This ensures:
- ✅ 100% accuracy
- ✅ Current pricing
- ✅ Correct trim levels
- ✅ Regional variations (if needed)

The automated scrapers are helpful for initial population but should be verified manually.
