# Product Import/Export Guide

## Export Products

1. Click the "Export" button in the products page
2. A CSV file will be downloaded with all current products
3. The file will be named `products_YYYY-MM-DD.csv`

## Import Products

### CSV Format Requirements

Your CSV file should have the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| title | Yes | Product name |
| description | No | Product description |
| price | Yes | Product price (number) |
| category | Yes | Product category |
| brand | No | Product brand |
| quantity | No | Stock quantity (default: 0) |
| sold | No | Number sold (default: 0) |
| tags | No | Comma-separated tags |
| images | No | JSON array of image URLs |
| color | No | JSON array of colors |

### Sample CSV Format

```csv
title,description,price,category,brand,quantity,sold,tags,images,color
Sample Product,This is a sample product,99.99,Electronics,Sample Brand,100,0,"sample,electronics",[],[]
```

### Import Steps

1. Prepare your CSV file with the correct format
2. Click the "Import" button in the products page
3. Select your CSV file
4. Wait for the import to complete
5. You'll see a success message with the number of products imported

### File Requirements

- File type: CSV only
- Maximum file size: 5MB
- Encoding: UTF-8 recommended

### Troubleshooting

- **"No valid products found"**: Check that your CSV has the required columns (title, price, category)
- **"Failed to parse CSV"**: Ensure your CSV file is properly formatted
- **"File size too large"**: Reduce your file size to under 5MB
- **"Only CSV files are allowed"**: Make sure you're uploading a .csv file

### Notes

- Images and colors should be in JSON format: `["url1", "url2"]`
- Tags should be comma-separated
- Empty fields will use default values
- Invalid rows will be skipped with a warning 