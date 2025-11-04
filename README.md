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
- **User Flow**: Both registered and unregistered users can use the hardware
  - New users get temporary profiles automatically
  - Points are tracked immediately
  - Users can register online later to claim accumulated points

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
│   ├── check-user/   # Verify user existence
│   ├── register-user/ # Create temporary hardware user
│   ├── submit-waste/ # Waste submission endpoint
│   └── send-confirmation-email/ # Email notifications
└── migrations/       # Database migrations
```

### Database Schema

**profiles**
- User account information and unique deposit codes
- Fields: `id`, `full_name`, `username`, `unique_code`, `points`, `is_registered`, `created_at`, `updated_at`
- `is_registered`: `true` for fully registered users, `false` for hardware-only users

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
This project implements a fully automated, internet-connected smart waste sorting machine built around the ESP32 and ESP32-CAM. It uses Machine Learning (via Edge Impulse) to classify waste and a load cell to accurately measure the deposited weight. A custom backend (using Supabase) handles user authentication, data logging, and rewards tracking.

 Key Features
**Machine Learning Sorting:** Utilizes an ESP32-CAM module running an Edge Impulse model to classify waste (e.g., Plastic Bottle, Nylon).
**User Authentication:** Users authenticate via a Keypad (phone ID) before starting the sorting process.
**IoT Connectivity:** Connects to a Supabase backend via Wi-Fi to verify user accounts and log waste transaction data.
**Accurate Weighing:** An HX711 Load Cell measures the weight of the deposited waste for reward calculation.
**Automated Control:** Servo Motors manage the lid opening/closing and the waste sorting gate.
**Power Efficiency:** Implements Deep Sleep mode, waking only when a key is pressed to conserve power.
**Robust Session Management:** Features Auto-Stop based on weight stabilization and Manual Finish
**Main ESP32 controller**
**Component**,**Function**,**Pins Used**,**Libraries**
ESP32 Dev Board,"Main logic, WiFi, HTTP",-,-
HX711 Load Cell,Weight Measurement,"DOUT (19), CLK (18)",HX711
16x2 I2C LCD,User Interface/Feedback,"SDA (21), SCL (22)",LiquidCrystal_I2C
4x3 Keypad,"User Input (ID, Control)","Rows (13, 12, 14, 27), Cols (26, 25, 33)",Keypad
Lid Servo,Opens/Closes the waste inlet,GPIO 5,ESP32_Servo
Sorter Servo,Directs waste to the correct bin,GPIO 4,ESP32_Servo
Serial Connection (to CAM),Communicates with the Classifier,"TX (17), RX (16)",HardwareSerial (2)
## Classifier AI 
**Component**,    **Function**,      **Notes**
ESP32-CAM,Image Capture & ML Inference,Runs the Edge Impulse model.
Serial Connection (to Master),Sends classification results (via UART0),Wired to the Master's Serial2.
##Wiring Diagram 
**Master ESP32 Pin**    ,**Component Connection**,        **Notes**
5V / VIN,"Power Supply  , Servos, HX711, LCD",      Ensure adequate power supply for servos.
GND,  All Component Grounds  ,Common Ground.
GPIO 4,  Sorter Servo Signal,  Moves waste left/right.
GPIO 5,  Lid Servo Signal,  Opens/Closes inlet.
GPIO 18 / 19,HX711 CLK / DOUT,Load cell module.
GPIO 21 / 22,LCD SDA / SCL,I2C Communication.
GPIO 17 (TX2)  ,ESP32-CAM RX (U0RXD)  ,"Master sends ""CAP""."
GPIO 16 (RX2),  ESP32-CAM TX (U0TXD),  Master receives JSON prediction.
"GPIO 12, 13, 14, 27",Keypad Row Pins,Must be RTC-capable for Deep Sleep wakeup.
"GPIO 25, 26, 33",Keypad Column Pins,-
**Software and Setup**
1. **Arduino IDE Setup**
Install the following libraries via the Arduino Library Manager:
LiquidCrystal_I2C
Keypad
ESP32_Servo (Specific for ESP32)
HX711
ArduinoJson
2. **Networking and Backend (Supabase)**
This project requires a live Supabase project configured with the following Edge Functions:

**check-user**: Verifies if a user exists in the database
- Endpoint: `/functions/v1/check-user`
- Input: `{ "unique_code": "string" }`
- Output: `{ "exists": boolean, "user_id": "uuid", "is_registered": boolean }`

**register-user**: Creates a temporary hardware-only user profile
- Endpoint: `/functions/v1/register-user`
- Input: `{ "unique_code": "string" }`
- Output: `{ "success": boolean, "user_id": "uuid", "is_registered": false }`
- Note: Creates users with `is_registered: false` who can later claim their points by registering online

**submit-waste**: Logs waste deposits and credits points
- Endpoint: `/functions/v1/submit-waste`
- Input: `{ "unique_code": "string", "weight_kg": number, "location_id": "uuid (optional)" }`
- Output: Transaction details and updated point balance
3. **ESP32-CAM Classifier**
The second sketch (esp32cam_classifier.ino) is for the ESP32-CAM and is based on an Edge Impulse classification model.
Edge Impulse Project: Create an object detection or image classification project on Edge Impulse and deploy the C++ Library for the ESP32 platform.
**Model Integration**: Place the generated library files into your Arduino libraries folder and ensure the main code includes the necessary headers (<waste_inferencing.h>).
**Firmware:** Flash the esp32cam_classifier.ino sketch to the ESP32-CAM.
##**Operation Flow**
**Deep Sleep**: System is asleep, conserving power.
**Wake Up**: User presses any key on the keypad.
**Authentication (STATE_IDLE)**: 
   - User enters a phone number or unique code and presses #
   - ESP32 calls the `check-user` edge function to verify if user exists
   - **If user exists**: Proceeds to sorting (registered or hardware-only user)
   - **If user doesn't exist**: ESP32 calls `register-user` edge function to create a temporary profile
   - New hardware-only users can immediately start sorting and earn points
   - They can later register online using the signup form to claim their accumulated points
**Sorting (STATE_SORTING):**
Lid opens. LCD prompts the user to place waste.
The ESP32 Master repeatedly sends the CAP command to the ESP32-CAM via Serial2.
The ESP32-CAM captures an image, runs inference, and sends back a JSON prediction ({"prediction":"Bottle"}).
The Sorter Servo moves to the predicted bin angle (0 for Bottle, 180 for Nylon).
The session is finalized either by Manual Finish (# key) or Auto-Stop (no significant weight change for 4 seconds).
**Uploading (STATE_UPLOADING):**
Lid closes. Final weight is measured.
The waste type, net weight, and user ID are sent to the Supabase backend for reward processing.
Return to Sleep (STATE_SLEEP): The system goes back to Deep Sleep mode.

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
   supabase functions deploy check-user
   supabase functions deploy register-user
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
