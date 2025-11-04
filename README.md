# Trash to Cash Documentation

**A comprehensive recycling rewards platform that turns waste into cash through smart bin integration.**

**Live URL**: https://trash-to-cash-gamma.vercel.app

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Software Developer Guide](#software-developer-guide)
5. [Hardware Developer Guide](#hardware-developer-guide)
6. [Hardware-Software Integration](#hardware-software-integration)
7. [Deployment](#deployment)

---

## Project Overview

Trash to Cash is a full-stack recycling incentive platform that rewards users for depositing recyclable waste at smart collection points. The system consists of:

- **Web Application**: User dashboard for tracking earnings, viewing transaction history, managing withdrawals, and viewing leaderboards
- **Admin Panel**: Location management, user management, and system monitoring
- **Smart Bins**: IoT-enabled recycling bins that weigh waste and submit data to the cloud
- **Backend API**: Supabase-powered backend with Edge Functions for processing transactions

### Key Features

- 🎁 **Rewards System**: Earn ₦10,000 per kg of recyclable waste (1 point = ₦1)
- 📍 **Location Tracking**: Find nearby recycling locations with real-time capacity status
- 💰 **Instant Withdrawals**: Convert points to cash with minimum ₦50 withdrawal
- 🏆 **Leaderboards**: Compete with other users (admins excluded from rankings)
- 🔐 **Secure Authentication**: Phone number or email-based authentication
- 📊 **Analytics Dashboard**: Track personal recycling impact and earnings
- 🛠️ **Admin Tools**: Manage locations, users, and monitor system health

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Edge Functions (Deno)
  - Authentication
- **Resend** - Email service for withdrawal confirmations

### Hardware Integration
- **REST API** - HTTP endpoints for bin communication
- **ESP32/Arduino** - Supported microcontrollers
- **Load Cell Sensors** - Weight measurement
- **WiFi Modules** - Network connectivity

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git
- Supabase account (for backend)

### Local Development Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

### Alternative Development Methods

**GitHub Codespaces**
1. Navigate to repository main page
2. Click "Code" → "Codespaces" → "New codespace"
3. Edit files directly in browser-based VS Code

**Direct GitHub Editing**
1. Navigate to desired file
2. Click "Edit" (pencil icon)
3. Make changes and commit

---

## Software Developer Guide

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navigation.tsx # Main navigation bar
│   └── ui/           # shadcn components
├── pages/            # Route pages
│   ├── Index.tsx     # Landing/home page
│   ├── Auth.tsx      # Login/signup
│   ├── Dashboard.tsx # User dashboard
│   ├── History.tsx   # Transaction history
│   ├── Leaderboard.tsx # Rankings
│   ├── Locations.tsx # Recycling locations map
│   └── Admin.tsx     # Admin panel
├── integrations/     # External service integrations
│   └── supabase/     # Supabase client & types
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── main.tsx          # App entry point

supabase/
├── functions/        # Edge Functions
│   ├── submit-waste/ # Waste submission endpoint
│   └── send-confirmation-email/ # Email notifications
└── migrations/       # Database migrations
```

### Database Schema

**profiles**
- User account information and unique deposit codes
- Fields: `id`, `full_name`, `username`, `unique_code`, `balance`, `total_earned`, `email`, `phone_number`

**locations**
- Recycling bin locations with capacity tracking
- Fields: `id`, `name`, `address`, `latitude`, `longitude`, `capacity_kg`, `current_load_kg`, `status`

**transactions**
- Waste deposit records
- Fields: `id`, `user_id`, `location_id`, `waste_type`, `weight_kg`, `points_earned`, `created_at`

**withdrawals**
- Cash withdrawal requests
- Fields: `id`, `user_id`, `amount`, `status`, `bank_details`, `created_at`, `processed_at`

**user_roles**
- Admin role assignments
- Fields: `id`, `user_id`, `role`, `created_at`

### Key Features Implementation

**Authentication Flow**
```typescript
// Using Supabase Auth
import { supabase } from "@/integrations/supabase/client";

// Sign up with phone
const { data, error } = await supabase.auth.signUp({
  phone: phoneNumber,
  password: password,
});

// Check authentication state
const { data: { session } } = await supabase.auth.getSession();
```

**Real-time Updates**
```typescript
// Subscribe to balance changes
const subscription = supabase
  .channel('profile-changes')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'profiles' },
    (payload) => {
      // Update UI with new balance
    }
  )
  .subscribe();
```

**Admin Role Check**
```typescript
// Using custom database function
const { data: isAdmin } = await supabase
  .rpc('has_role', { 
    _user_id: userId, 
    _role: 'admin' 
  });
```

### Adding New Features

1. **Create Component**: Add to `src/components/` or `src/pages/`
2. **Add Route**: Update `src/App.tsx` with new route
3. **Database Changes**: Use Supabase migration tool
4. **API Integration**: Add queries in component using TanStack Query
5. **Type Safety**: Update types in `src/integrations/supabase/types.ts` (auto-generated)

### Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Hardware Developer Guide

### Supported Hardware

- **Microcontrollers**: ESP32, ESP8266, Arduino with WiFi shield
- **Sensors**: HX711 load cell amplifier + load cell (up to 50kg recommended)
- **Power**: 5V USB or battery pack with voltage regulator
- **Connectivity**: WiFi (2.4GHz)

### Hardware Setup

**Wiring Diagram (ESP32 + HX711)**

```
HX711 Load Cell Amplifier → ESP32
--------------------------------
VCC  → 3.3V
GND  → GND
DT   → GPIO 4 (Data)
SCK  → GPIO 5 (Clock)

Load Cell → HX711
-----------------
RED   → E+
BLACK → E-
WHITE → A-
GREEN → A+
```

### Calibration Process

1. **Zero Calibration**: Run with no weight to get baseline reading
2. **Weight Calibration**: Place known weight (e.g., 1kg) and calculate scale factor
3. **Save Calibration**: Store factor in EEPROM or code constant

```cpp
// Example calibration code
#include "HX711.h"

const int LOADCELL_DOUT_PIN = 4;
const int LOADCELL_SCK_PIN = 5;
HX711 scale;

void calibrate() {
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  
  // Tare (zero) the scale
  scale.tare();
  
  // Place known weight (1000g)
  Serial.println("Place 1kg weight now...");
  delay(5000);
  
  // Calculate scale factor
  float reading = scale.get_units(10);
  float calibration_factor = reading / 1000.0;
  
  scale.set_scale(calibration_factor);
}
```

### Sample Arduino/ESP32 Code

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include "HX711.h"

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint
const char* apiUrl = "https://your-project.supabase.co/functions/v1/submit-waste";

// Load cell pins
const int LOADCELL_DOUT_PIN = 4;
const int LOADCELL_SCK_PIN = 5;
HX711 scale;

// Calibration factor (adjust after calibration)
float calibration_factor = 2280.0;

void setup() {
  Serial.begin(115200);
  
  // Initialize scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor);
  scale.tare();
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  // Read weight
  float weight = scale.get_units(5) / 1000.0; // Convert to kg
  
  if (weight > 0.1) { // Minimum 100g threshold
    Serial.printf("Weight detected: %.2f kg\n", weight);
    
    // Submit to API
    submitWaste("ABC12345", "plastic", weight, "location-uuid");
    
    // Wait for removal
    delay(5000);
    scale.tare(); // Reset scale
  }
  
  delay(100);
}

void submitWaste(String uniqueCode, String wasteType, float weight, String locationId) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Build JSON payload
    String payload = "{";
    payload += "\"unique_code\":\"" + uniqueCode + "\",";
    payload += "\"waste_type\":\"" + wasteType + "\",";
    payload += "\"weight_kg\":" + String(weight, 3) + ",";
    payload += "\"location_id\":\"" + locationId + "\"";
    payload += "}";
    
    // Send POST request
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error: " + String(httpResponseCode));
    }
    
    http.end();
  }
}
```

### Power Optimization

```cpp
// Use deep sleep between readings (ESP32)
#include "esp_sleep.h"

void goToSleep(int seconds) {
  esp_sleep_enable_timer_wakeup(seconds * 1000000);
  esp_deep_sleep_start();
}

// In loop, after submission:
goToSleep(60); // Sleep for 60 seconds
```

---

## Hardware-Software Integration

### API Endpoint: Submit Waste

**Endpoint**: `POST /functions/v1/submit-waste`

**Request Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "unique_code": "ABC12345",
  "waste_type": "plastic",
  "weight_kg": 1.5,
  "location_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Parameters**
- `unique_code` (required): 8-character user identifier from their profile
- `waste_type` (required): Type of waste - "plastic", "paper", "metal", "glass", or "other"
- `weight_kg` (required): Weight in kilograms (minimum 0.0001 kg)
- `location_id` (optional): UUID of the location where waste was deposited

**Success Response** (200 OK)
```json
{
  "success": true,
  "message": "Waste deposited successfully",
  "data": {
    "transaction_id": "uuid",
    "points_earned": 15000,
    "new_balance": 25000,
    "weight_kg": 1.5
  }
}
```

**Error Responses**

400 Bad Request
```json
{
  "error": "Invalid request",
  "details": "weight_kg must be at least 0.0001"
}
```

404 Not Found
```json
{
  "error": "User not found with code: ABC12345"
}
```

500 Internal Server Error
```json
{
  "error": "Failed to process waste deposit"
}
```

### Points Calculation

- **Rate**: 10,000 points per kilogram
- **Formula**: `points = weight_kg × 10000`
- **Conversion**: 1 point = ₦1 (Nigerian Naira)
- **Minimum Weight**: 0.0001 kg (0.1 gram)
- **Examples**:
  - 0.5 kg = 5,000 points = ₦5,000
  - 2.0 kg = 20,000 points = ₦20,000

### Location Capacity Management

Locations automatically update status when reaching capacity:

```sql
-- Location status values
status: 'active' | 'full' | 'maintenance'

-- Checked on each deposit
current_load_kg >= capacity_kg → status = 'full'
```

### Integration Testing

**Using cURL**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/submit-waste \
  -H "Content-Type: application/json" \
  -d '{
    "unique_code": "ABC12345",
    "waste_type": "plastic",
    "weight_kg": 1.5,
    "location_id": "location-uuid"
  }'
```

**Using Python**
```python
import requests

def submit_waste(unique_code, waste_type, weight_kg, location_id=None):
    url = "https://your-project.supabase.co/functions/v1/submit-waste"
    
    payload = {
        "unique_code": unique_code,
        "waste_type": waste_type,
        "weight_kg": weight_kg,
    }
    
    if location_id:
        payload["location_id"] = location_id
    
    response = requests.post(url, json=payload)
    return response.json()

# Example usage
result = submit_waste("ABC12345", "plastic", 1.5)
print(result)
```

### Security Considerations

1. **Public Endpoint**: No authentication required for bin submissions
2. **Rate Limiting**: Implement on hardware side to prevent abuse
3. **Validation**: All inputs validated server-side
4. **User Privacy**: Row Level Security (RLS) protects user data
5. **Location Verification**: Optional but recommended for production

### Troubleshooting

**Common Issues**

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 User not found | Invalid unique_code | Verify code from user profile |
| Weight too low | Below 0.0001 kg threshold | Check sensor calibration |
| Location full | Capacity reached | Update location capacity or status |
| WiFi timeout | Network issue | Add retry logic with exponential backoff |
| Calibration drift | Temperature/time | Recalibrate sensor periodically |

**Edge Function Logs**

Check logs in Supabase Dashboard → Edge Functions → submit-waste → Logs

---

## Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables** (Set in Vercel Dashboard)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Backend Deployment (Supabase)

1. **Database Migrations**: Automatically applied via Supabase CLI
2. **Edge Functions**: 
   ```bash
   supabase functions deploy submit-waste
   supabase functions deploy send-confirmation-email
   ```
3. **Secrets Configuration**: Set in Supabase Dashboard → Project Settings → Edge Functions
   - `RESEND_API_KEY`
   - `SEND_CONFIRMATION_EMAIL_HOOK_SECRET`

### Custom Domain Setup

**Vercel**
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

---

## Support & Contributing

- **Issues**: Report bugs via GitHub Issues
- **Feature Requests**: Submit via GitHub Discussions
- **Edge Function Logs**: Supabase Dashboard → Edge Functions
- **Database Logs**: Supabase Dashboard → Database → Logs

---

## License

This project is deployed and maintained as part of the Trash to Cash recycling initiative.
