# Trash to Cash - API Documentation

## Hardware Integration API

### Submit Waste Endpoint

**Endpoint:** `POST /functions/v1/submit-waste`  
**Authentication:** None required (public endpoint)

This endpoint is used by smart recycling bins to submit waste deposits and automatically credit user accounts.

#### Request Body

```json
{
  "unique_code": "ABC12345",
  "waste_type": "metal",
  "weight_kg": 2.5,
  "location_id": "optional-uuid-here"
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| unique_code | string | Yes | User's 8-character unique code |
| waste_type | string | Yes | Type of waste: "metal" or "non-metal" |
| weight_kg | number | Yes | Weight of waste in kilograms (must be > 0) |
| location_id | string | No | UUID of the recycling location (optional) |

#### Points Calculation

- **Metal waste:** 5 points per kg
- **Non-metal waste:** 2 points per kg

#### Response (Success)

```json
{
  "success": true,
  "transaction": {
    "id": "transaction-uuid",
    "user": {
      "full_name": "John Doe",
      "username": "johndoe"
    },
    "waste_type": "metal",
    "weight_kg": 2.5,
    "points_earned": 12.5,
    "new_balance": 112.5
  }
}
```

#### Response (Error)

```json
{
  "error": "Invalid unique code"
}
```

#### Status Codes

- `200` - Success
- `400` - Bad request (missing or invalid parameters)
- `404` - User not found (invalid unique code)
- `500` - Internal server error

### Example Usage (cURL)

```bash
curl -X POST https://nkrirpjmixfrunhmrawz.supabase.co/functions/v1/submit-waste \
  -H "Content-Type: application/json" \
  -d '{
    "unique_code": "ABC12345",
    "waste_type": "metal",
    "weight_kg": 2.5,
    "location_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Example Usage (Python)

```python
import requests

url = "https://nkrirpjmixfrunhmrawz.supabase.co/functions/v1/submit-waste"
payload = {
    "unique_code": "ABC12345",
    "waste_type": "metal",
    "weight_kg": 2.5,
    "location_id": "550e8400-e29b-41d4-a716-446655440000"
}

response = requests.post(url, json=payload)
print(response.json())
```

### Example Usage (Arduino/ESP32)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

void submitWaste(String uniqueCode, String wasteType, float weight) {
  HTTPClient http;
  http.begin("https://nkrirpjmixfrunhmrawz.supabase.co/functions/v1/submit-waste");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> doc;
  doc["unique_code"] = uniqueCode;
  doc["waste_type"] = wasteType;
  doc["weight_kg"] = weight;
  doc["location_id"] = "your-location-id";
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  int httpResponseCode = http.POST(requestBody);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(response);
  } else {
    Serial.print("Error: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}
```

## Location Capacity Management

When a location reaches its maximum capacity:

1. The location's `status` is automatically updated to "full"
2. The `current_weight_kg` is updated with the new total
3. A log message is generated (future: webhook/notification to recycling company)

### Location Status

- **available**: Location has capacity for more waste
- **full**: Location has reached maximum capacity (needs pickup)

## Withdrawal System

Users can withdraw their earnings:

- **Conversion Rate:** ₦1 = 10 points
- **Minimum Withdrawal:** ₦50 (500 points)
- **Status:** pending → completed/failed

## Database Schema

### profiles
- `id` (UUID, Primary Key)
- `full_name` (TEXT)
- `username` (TEXT, Unique)
- `unique_code` (TEXT, Unique) - 8-character code
- `points` (DECIMAL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### locations
- `id` (UUID, Primary Key)
- `name` (TEXT)
- `address` (TEXT)
- `status` ('available' | 'full')
- `capacity_kg` (DECIMAL)
- `current_weight_kg` (DECIMAL)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)

### transactions
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `location_id` (UUID, Foreign Key)
- `waste_type` ('metal' | 'non-metal')
- `weight_kg` (DECIMAL)
- `points_earned` (DECIMAL)
- `created_at` (TIMESTAMP)

### withdrawals
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `points_deducted` (DECIMAL)
- `amount_naira` (DECIMAL)
- `status` ('pending' | 'completed' | 'failed')
- `created_at` (TIMESTAMP)

## Security Notes

1. The API uses Row Level Security (RLS) to protect user data
2. Users can only view their own transactions and withdrawals
3. The submit-waste endpoint is public (no JWT required) for hardware integration
4. All sensitive operations use server-side validation

## Support

For API support or questions, check the edge function logs in the Supabase dashboard.
