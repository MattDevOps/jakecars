import json
import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import quote

def clean_price(price_text):
    """Extract numeric price from text"""
    # Remove currency symbols and commas
    price_text = re.sub(r'[^\d.]', '', price_text)
    try:
        return int(float(price_text))
    except:
        return None

def get_wikipedia_price(brand, model, year="2024"):
    """Scrape price from Wikipedia infobox"""
    try:
        # Format search query
        search_query = f"{year} {brand} {model}"
        url = f"https://en.wikipedia.org/wiki/{quote(search_query)}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            # Try alternative URL format
            url = f"https://en.wikipedia.org/wiki/{quote(f'{brand} {model}')}"
            response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for infobox with price information
            infobox = soup.find('table', class_='infobox')
            if infobox:
                # Look for price in various formats
                rows = infobox.find_all('tr')
                for row in rows:
                    th = row.find('th')
                    td = row.find('td')
                    if th and td:
                        label = th.get_text().lower()
                        value = td.get_text()
                        
                        # Check for price-related labels
                        if any(keyword in label for keyword in ['price', 'msrp', 'base', 'starting', 'cost']):
                            price = clean_price(value)
                            if price and 10000 < price < 200000:  # Reasonable car price range
                                return price
                
                # Also check for price in text content
                text = infobox.get_text()
                price_patterns = [
                    r'\$[\d,]+',
                    r'USD\s*[\d,]+',
                    r'MSRP[:\s]*\$?[\d,]+',
                    r'Base[:\s]*\$?[\d,]+'
                ]
                for pattern in price_patterns:
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    for match in matches:
                        price = clean_price(match)
                        if price and 10000 < price < 200000:
                            return price
        
        time.sleep(1)  # Be respectful with requests
        return None
    except Exception as e:
        print(f"Error fetching Wikipedia for {brand} {model}: {e}")
        return None

def get_edmunds_price(brand, model, year="2024"):
    """Try to get price from Edmunds (more reliable for car prices)"""
    try:
        # Edmunds URL structure
        model_slug = model.lower().replace(' ', '-')
        brand_slug = brand.lower().replace(' ', '-')
        url = f"https://www.edmunds.com/{brand_slug}/{model_slug}/{year}/"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for price information
            price_elements = soup.find_all(text=re.compile(r'\$[\d,]+'))
            for element in price_elements:
                price = clean_price(element)
                if price and 10000 < price < 200000:
                    return price
        
        time.sleep(1)
        return None
    except Exception as e:
        print(f"Error fetching Edmunds for {brand} {model}: {e}")
        return None

def update_database_prices(database_file='verified-car-database-expanded.json', output_file=None):
    """Update prices in the car database"""
    if output_file is None:
        output_file = database_file
    
    # Load database
    with open(database_file, 'r', encoding='utf-8') as f:
        database = json.load(f)
    
    updated_count = 0
    failed_count = 0
    
    print(f"Updating prices for {len(database)} cars...")
    print("This may take a while. Please be patient.\n")
    
    for key, car in database.items():
        brand = car['brand']
        model = car['name']
        year = car.get('year', '2024')
        current_price = car.get('msrp', '')
        
        print(f"Checking {year} {brand} {model}...", end=' ')
        
        # Try multiple sources
        price = None
        
        # Try Edmunds first (more reliable for car prices)
        price = get_edmunds_price(brand, model, year)
        
        # Fallback to Wikipedia
        if not price:
            price = get_wikipedia_price(brand, model, year)
        
        if price:
            car['msrp'] = f"${price:,}"
            updated_count += 1
            print(f"✓ Updated to ${price:,}")
        else:
            failed_count += 1
            print(f"✗ Could not find price (keeping: {current_price})")
        
        # Save progress periodically
        if (updated_count + failed_count) % 10 == 0:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(database, f, indent=2, ensure_ascii=False)
            print(f"\nProgress saved: {updated_count + failed_count}/{len(database)} cars checked\n")
    
    # Final save
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*50}")
    print(f"Update complete!")
    print(f"Updated: {updated_count} cars")
    print(f"Failed: {failed_count} cars")
    print(f"{'='*50}")

if __name__ == "__main__":
    import sys
    
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'verified-car-database-expanded.json'
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    print("Car Price Updater")
    print("="*50)
    print("Note: This script attempts to fetch accurate prices from:")
    print("  1. Edmunds.com (primary source)")
    print("  2. Wikipedia (fallback)")
    print("\nFor best results, consider manually verifying prices from:")
    print("  - Official manufacturer websites")
    print("  - Edmunds.com")
    print("  - KBB.com")
    print("  - Car and Driver")
    print("="*50)
    print()
    
    try:
        update_database_prices(input_file, output_file)
    except KeyboardInterrupt:
        print("\n\nUpdate interrupted by user. Progress has been saved.")
    except Exception as e:
        print(f"\nError: {e}")
