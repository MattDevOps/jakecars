"""
Wikipedia Car Price Scraper
Scrapes car prices from Wikipedia infoboxes
"""
import json
import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import quote

def extract_price(text):
    """Extract price from text, handling various formats"""
    # Patterns to match prices
    patterns = [
        r'\$[\d,]+',  # $45,000
        r'USD\s*[\d,]+',  # USD 45000
        r'MSRP[:\s]*\$?[\d,]+',  # MSRP: $45,000
        r'Base[:\s]*\$?[\d,]+',  # Base: $45,000
        r'Starting[:\s]*\$?[\d,]+',  # Starting: $45,000
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            # Extract numbers
            numbers = re.sub(r'[^\d]', '', match)
            if numbers:
                price = int(numbers)
                # Reasonable car price range
                if 10000 <= price <= 200000:
                    return price
    return None

def get_wikipedia_car_info(brand, model, year="2024"):
    """Get car information from Wikipedia"""
    results = {
        'price': None,
        'url': None
    }
    
    try:
        # Try different Wikipedia page formats
        search_queries = [
            f"{year} {brand} {model}",
            f"{brand} {model}",
            f"{brand} {model} ({year})",
            f"{model} ({year})",  # Sometimes just model and year
        ]
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        for query in search_queries:
            try:
                url = f"https://en.wikipedia.org/wiki/{quote(query)}"
                response = requests.get(url, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    results['url'] = url
                    
                    # Find infobox
                    infobox = soup.find('table', class_='infobox')
                    if infobox:
                        # Get all text from infobox
                        infobox_text = infobox.get_text()
                        
                        # Look for price in table rows first (more accurate)
                        rows = infobox.find_all('tr')
                        for row in rows:
                            th = row.find('th')
                            td = row.find('td')
                            if th and td:
                                label = th.get_text().lower()
                                value = td.get_text()
                                
                                # Check for price-related fields
                                price_keywords = ['price', 'msrp', 'base', 'starting', 'cost', 'retail', 'usd']
                                if any(keyword in label for keyword in price_keywords):
                                    price = extract_price(value)
                                    if price:
                                        results['price'] = price
                                        return results
                        
                        # If not found in structured rows, search all infobox text
                        price = extract_price(infobox_text)
                        if price:
                            results['price'] = price
                            return results
                    
                    # Also check the main article content for price mentions
                    # Look for sections about pricing
                    content = soup.find('div', id='mw-content-text')
                    if content:
                        # Look for pricing sections
                        headings = content.find_all(['h2', 'h3'])
                        for heading in headings:
                            heading_text = heading.get_text().lower()
                            if any(keyword in heading_text for keyword in ['price', 'pricing', 'cost', 'msrp']):
                                # Get the paragraph after this heading
                                next_p = heading.find_next_sibling('p')
                                if next_p:
                                    price = extract_price(next_p.get_text())
                                    if price:
                                        results['price'] = price
                                        return results
                        
                        # Search all paragraphs for price mentions
                        paragraphs = content.find_all('p')
                        for p in paragraphs[:10]:  # Check first 10 paragraphs
                            text = p.get_text()
                            # Look for price patterns with context
                            if any(keyword in text.lower() for keyword in ['msrp', 'base price', 'starting at', 'costs']):
                                price = extract_price(text)
                                if price:
                                    results['price'] = price
                                    return results
                
                time.sleep(0.5)  # Be respectful
            except Exception as e:
                continue
        
        return results
    except Exception as e:
        print(f"  Error: {e}")
        return results

def update_database_from_wikipedia(database_file='verified-car-database-expanded.json'):
    """Update car database with Wikipedia prices"""
    
    # Load database
    print(f"Loading database from {database_file}...")
    with open(database_file, 'r', encoding='utf-8') as f:
        database = json.load(f)
    
    updated = 0
    not_found = 0
    errors = 0
    
    print(f"\nProcessing {len(database)} cars...")
    print("="*60)
    
    for i, (key, car) in enumerate(database.items(), 1):
        brand = car['brand']
        model = car['name']
        year = car.get('year', '2024')
        current_price = car.get('msrp', 'N/A')
        
        print(f"\n[{i}/{len(database)}] {year} {brand} {model}")
        print(f"  Current price: {current_price}")
        
        info = get_wikipedia_car_info(brand, model, year)
        
        if info['price']:
            car['msrp'] = f"${info['price']:,}"
            updated += 1
            print(f"  [OK] Updated to: ${info['price']:,}")
            if info['url']:
                print(f"  Source: {info['url']}")
        else:
            not_found += 1
            print(f"  [X] Price not found on Wikipedia")
        
        # Save every 10 cars
        if i % 10 == 0:
            backup_file = database_file.replace('.json', '_backup.json')
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(database, f, indent=2, ensure_ascii=False)
            print(f"\n  → Progress saved to backup")
    
    # Final save
    output_file = database_file.replace('.json', '_updated.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total cars processed: {len(database)}")
    print(f"Prices updated: {updated}")
    print(f"Prices not found: {not_found}")
    print(f"Errors: {errors}")
    print(f"\nUpdated database saved to: {output_file}")
    print("\nNOTE: Please verify prices manually from official sources:")
    print("  - Manufacturer websites")
    print("  - Edmunds.com")
    print("  - KBB.com")

if __name__ == "__main__":
    import sys
    
    database_file = sys.argv[1] if len(sys.argv) > 1 else 'verified-car-database-expanded.json'
    
    print("Wikipedia Car Price Scraper")
    print("="*60)
    print("This script will attempt to find car prices from Wikipedia.")
    print("Note: Wikipedia may not always have current/accurate pricing.")
    print("="*60)
    print()
    
    try:
        update_database_from_wikipedia(database_file)
    except KeyboardInterrupt:
        print("\n\nProcess interrupted. Partial results may be saved.")
    except FileNotFoundError:
        print(f"\nError: Database file '{database_file}' not found.")
    except Exception as e:
        print(f"\nError: {e}")
