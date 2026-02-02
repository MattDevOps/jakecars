"""Test the price scraper on a few cars first"""
import json
from update_prices_wikipedia import get_wikipedia_car_info

# Test on a few cars
test_cars = [
    {"brand": "Honda", "model": "Accord", "year": "2024"},
    {"brand": "Toyota", "model": "Camry", "year": "2024"},
    {"brand": "Tesla", "model": "Model 3", "year": "2024"},
    {"brand": "Ford", "model": "F-150", "year": "2024"},
    {"brand": "BMW", "model": "3 Series", "year": "2024"},
]

print("Testing Wikipedia Price Scraper")
print("="*60)

for car in test_cars:
    print(f"\nTesting: {car['year']} {car['brand']} {car['model']}")
    info = get_wikipedia_car_info(car['brand'], car['model'], car['year'])
    
    if info['price']:
        print(f"  [OK] Found price: ${info['price']:,}")
        if info['url']:
            print(f"  Source: {info['url']}")
    else:
        print(f"  [X] Price not found")
        if info['url']:
            print(f"  Checked: {info['url']}")

print("\n" + "="*60)
print("Test complete!")
print("\nIf prices were found, you can run the full update:")
print("  python update_prices_wikipedia.py")
