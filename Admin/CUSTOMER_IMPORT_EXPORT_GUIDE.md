# Customer Import/Export Guide

## Export Customers

1. Click the "Export" button in the customers page
2. A CSV file will be downloaded with all current customers
3. The file will be named `customers_YYYY-MM-DD.csv`

## Import Customers

### CSV Format Requirements

Your CSV file should have the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| firstname | Yes | Customer's first name |
| lastname | Yes | Customer's last name |
| email | Yes | Customer's email address |
| mobile | No | Customer's phone number |
| password | Yes | Customer's password (will be hashed) |
| role | No | User role (default: "user") |
| isBlocked | No | Account status (default: false) |

### Sample CSV Format

```csv
firstname,lastname,email,mobile,password,role,isBlocked
John,Doe,john@example.com,1234567890,password123,user,false
Jane,Smith,jane@example.com,9876543210,password123,user,false
```

### Import Steps

1. Prepare your CSV file with the correct format
2. Click the "Import" button in the customers page
3. Select your CSV file
4. Wait for the import to complete
5. You'll see a success message with the number of customers imported

### File Requirements

- File type: CSV only
- Maximum file size: 5MB
- Encoding: UTF-8 recommended

### Troubleshooting

- **"No valid customers found"**: Check that your CSV has the required columns (firstname, lastname, email, password)
- **"Failed to parse CSV"**: Ensure your CSV file is properly formatted
- **"File size too large"**: Reduce your file size to under 5MB
- **"Only CSV files are allowed"**: Make sure you're uploading a .csv file
- **"Email already exists"**: The system will skip customers with existing email addresses

### Notes

- Passwords will be automatically hashed for security
- Duplicate email addresses will be skipped
- The role field defaults to "user" if not specified
- The isBlocked field defaults to "false" if not specified
- Invalid rows will be skipped with a warning

## Customer Management Features

### View Customers
- See all customers in a table format
- View customer details including name, email, phone, and status
- Filter and search customers

### Delete Customers
- Click the delete button next to any customer
- Confirm the deletion in the dialog
- Customer will be permanently removed from the system

### Customer Status
- **Active**: Customer account is active and can use the system
- **Blocked**: Customer account is blocked and cannot access the system

## API Endpoints

- `GET /api/customer/customers` - Get all customers
- `GET /api/customer/fetchCustomer/:id` - Get specific customer
- `PUT /api/customer/updateCustomer/:id` - Update customer
- `DELETE /api/customer/deleteCustomer/:id` - Delete customer
- `POST /api/customer/import` - Import customers from CSV
- `GET /api/customer/export` - Export customers to CSV 