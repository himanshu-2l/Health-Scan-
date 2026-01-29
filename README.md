# 🏥 Health Scan - Comprehensive Health Screening Platform

<div align="center">

![Health Scan Logo](https://img.shields.io/badge/Health%20Scan-Comprehensive%20Health%20Screening-blue?style=for-the-badge&logo=heart)

**Privacy-first browser lab bench for comprehensive health screening. All processing happens securely on your device.**


<!-- [![GitHub stars](https://img.shields.io/github/stars/GeekLuffy/healthscan?style=for-the-badge&logo=github)](https://github.com/GeekLuffy/healthscan)
[![GitHub forks](https://img.shields.io/github/forks/GeekLuffy/healthscan?style=for-the-badge&logo=github)](https://github.com/GeekLuffy/healthscan)
[![GitHub issues](https://img.shields.io/github/issues/GeekLuffy/healthscan?style=for-the-badge&logo=github)](https://github.com/GeekLuffy/healthscan/issues)
[![GitHub license](https://img.shields.io/github/license/GeekLuffy/healthscan?style=for-the-badge&logo=github)](https://github.com/GeekLuffy/healthscan/blob/main/LICENSE) -->

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 🌟 Overview

Health Scan is a comprehensive web-based health screening platform that combines advanced AI algorithms with multi-modal health testing to enable early detection and monitoring of various health conditions. Our platform integrates seamlessly with India's national health infrastructure (ABDM) and Google Fit, providing professional-grade medical screening capabilities with complete privacy and on-device processing.

### 🎯 Key Features

- **🔬 Multi-Modal Testing Labs**: Neurological (Voice, Motor, Eye, Memory, Cognitive), Cardiovascular, Mental Health, and Vision & Hearing assessments
- **🤖 AI-Powered Analysis**: Advanced algorithms for Parkinson's, Alzheimer's, cardiovascular conditions, and mental health screening
- **🏥 EHR Integration**: Seamless connection with ABDM (Ayushman Bharat Digital Mission) for health record management
- **📱 Google Fit Integration**: Connect and sync with Google Fit for comprehensive activity and health data tracking
- **💊 Chronic Disease Management**: Diabetes management with glucose tracking, meal planning, and insulin reminders
- **📊 Health Monitoring**: Body temperature tracking, blood pressure monitoring, and health score calculation
- **🚨 Early Warning System**: AI-powered alerts for health anomalies and risk factors
- **📈 Real-Time Monitoring**: Live data visualization and trend analysis
- **🔒 Privacy-First**: All processing happens securely on your device with FHIR-compliant data formats
- **🎨 Modern UI**: Glass-morphism design with accessibility features and responsive layout

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with camera/microphone access

### Installation

```bash
# Clone the repository
git clone https://github.com/GeekLuffy/healthscan.git
cd healthscan

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to access the application.

### Backend Server (Optional - for Google Fit integration)

If you want to use Google Fit integration, you'll need to run the backend server:

```bash
# Start the backend server (in a separate terminal)
node server.js
# or
node server.cjs
```

The backend server runs on `http://localhost:3000` by default.

## 🧪 Testing Labs

### 1. **Voice & Speech Lab**
- **Purpose**: Analyze vocal patterns for neurological conditions
- **Features**: 
  - Real-time pitch analysis
  - Jitter detection
  - Voice quality assessment
  - Speech pattern recognition
- **Conditions Detected**: Parkinson's disease, voice disorders

### 2. **Motor & Tremor Lab**
- **Purpose**: Assess movement patterns and motor control
- **Features**:
  - Finger tapping analysis
  - Tremor frequency measurement
  - Movement speed assessment
  - Coordination evaluation
- **Conditions Detected**: Parkinson's disease, essential tremor

### 3. **Eye & Cognition Lab**
- **Purpose**: Evaluate cognitive function and attention
- **Features**:
  - Saccade reaction time
  - Stroop test for attention
  - Visual attention assessment
  - Reaction time measurement
- **Conditions Detected**: Cognitive impairment, attention disorders

### 4. **Memory & Cognitive Lab**
- **Purpose**: Assess memory and cognitive function
- **Features**:
  - Digit span memory test
  - Word list recall assessment
  - Working memory evaluation
- **Conditions Detected**: Alzheimer's disease, cognitive impairment

### 5. **Cardiovascular Lab**
- **Purpose**: Monitor cardiovascular health and detect anomalies
- **Features**:
  - Heart rate variability (HRV) analysis
  - Pulse detection and analysis
  - Cardiovascular risk assessment
- **Conditions Detected**: Cardiovascular diseases, arrhythmias

### 6. **Mental Health Lab**
- **Purpose**: Screen for mental health conditions
- **Features**:
  - PHQ-9 depression screening
  - GAD-7 anxiety screening
  - Stress assessment
  - Mood tracking
- **Conditions Detected**: Depression, anxiety disorders

### 7. **Vision & Hearing Lab**
- **Purpose**: Assess visual and auditory function
- **Features**:
  - Visual acuity testing
  - Color blindness detection
  - Hearing frequency tests
  - Peripheral vision assessment
- **Conditions Detected**: Vision impairments, hearing loss

## 💊 Health Management Features

### Diabetes Management
- **Glucose Tracking**: Log and monitor blood glucose levels
- **Meal Planning**: AI-powered meal recommendations
- **Insulin Reminders**: Medication and insulin injection reminders
- **Diabetic Risk Calculator**: Assess diabetes risk factors

### Blood Pressure Monitoring
- **BP Tracking**: Log systolic and diastolic readings
- **Trend Analysis**: Visualize BP trends over time
- **AI Chatbot**: Get insights and recommendations for BP management

### Body Temperature Tracking
- **Temperature Logging**: Record body temperature readings
- **Fever Detection**: Automatic alerts for elevated temperatures
- **Historical Data**: Track temperature patterns

### Health Score
- **Comprehensive Scoring**: Calculate overall health score based on all metrics
- **Risk Assessment**: Identify health risk factors
- **Progress Tracking**: Monitor health improvements over time

### Early Warning Alerts
- **Anomaly Detection**: AI-powered detection of health anomalies
- **Risk Alerts**: Notifications for potential health risks
- **Preventive Recommendations**: Actionable health advice

## 🏥 EHR Integration

Health Scan integrates with India's national health infrastructure through ABDM (Ayushman Bharat Digital Mission):

### Features
- **ABHA ID Authentication**: Connect using your 14-digit ABHA ID
- **Medical History Access**: View existing health records
- **Test Results Upload**: Automatically save results to your EHR
- **FHIR Compliance**: Standardized medical data formats
- **Doctor Sharing**: Seamlessly share results with healthcare providers

### Sandbox Mode (Default)
- ✅ No credentials required for testing
- ✅ Demo patient data included
- ✅ Simulated authentication flow
- ✅ Test uploads logged to console

## 📱 Google Fit Integration

Health Scan seamlessly integrates with Google Fit to provide comprehensive health data tracking:

### Features
- **Activity Tracking**: Sync steps, distance, calories, and active minutes
- **Heart Rate Data**: Access heart rate measurements from connected devices
- **Sleep Data**: Track sleep patterns and duration
- **Weight & Body Metrics**: Monitor weight, BMI, and body composition
- **OAuth Authentication**: Secure Google account connection
- **Real-time Sync**: Automatic data synchronization

### Setup
1. Configure Google OAuth credentials in backend server
2. Connect your Google account through the dashboard
3. Grant permissions for health data access
4. View synced data in the Health Scan dashboard

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Fast build tool
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Recharts** - Data visualization and charts
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Express.js** - Web server framework
- **Google APIs** - Google Fit integration
- **Passport.js** - OAuth authentication
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing

### AI & Machine Learning
- **Google Gemini AI** - AI-powered chatbot and analysis
- **MediaPipe** - Real-time hand tracking and pose estimation
- **Web Audio API** - Voice analysis and processing
- **Custom Algorithms** - Health condition detection and risk assessment

### Data & Storage
- **FHIR** - Healthcare data standards
- **Local Storage** - Client-side data persistence
- **ABDM APIs** - National health infrastructure integration
- **Google Fit API** - Health and fitness data integration

## 📁 Project Structure

```
healthscan/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── labs/           # Testing lab components
│   │   │   ├── MotorLab.tsx
│   │   │   ├── VoiceLab.tsx
│   │   │   ├── EyeLab.tsx
│   │   │   ├── DigitSpanTest.tsx
│   │   │   ├── WordListTest.tsx
│   │   │   ├── CardiovascularLab.tsx
│   │   │   ├── MentalHealthLab.tsx
│   │   │   └── VisionHearingLab.tsx
│   │   ├── ui/             # Shadcn UI components
│   │   ├── GoogleFitIntegration.tsx
│   │   ├── BPTracker.tsx
│   │   ├── GlucoseTracker.tsx
│   │   ├── BodyTemperature.tsx
│   │   ├── ChatBot.tsx
│   │   └── ...
│   ├── contexts/           # React context providers
│   │   ├── ThemeContext.tsx
│   │   ├── SettingsContext.tsx
│   │   └── EHRContext.tsx
│   ├── pages/              # Route components
│   │   ├── Dashboard.tsx
│   │   ├── Labs.tsx
│   │   ├── EHRPage.tsx
│   │   ├── DiabetesManagementPage.tsx
│   │   └── ...
│   ├── services/           # API and external services
│   │   ├── ehrService.ts
│   │   ├── healthScoreService.ts
│   │   ├── bpService.ts
│   │   ├── glucoseService.ts
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   │   ├── ehr.ts
│   │   └── health.ts
│   └── utils/              # Utility functions
│       ├── fhirConverter.ts
│       ├── pulseDetection.ts
│       └── ...
├── api/                    # Vercel serverless functions
│   ├── google-fit/        # Google Fit API endpoints
│   ├── body-temperature.js
│   └── generate-report.js
├── backend/                # Backend server files
│   ├── googleFitService.js
│   └── googleFitService.cjs
├── server.js               # Express backend server
├── public/                 # Static assets
├── docs/                   # Documentation
└── ...
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Gemini AI API Key (for ChatBot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# ABDM Configuration (Optional - Sandbox mode works without these)
VITE_ABDM_BASE_URL=https://dev.abdm.gov.in/gateway
VITE_ABDM_CLIENT_ID=your_abdm_client_id_here
VITE_ABDM_CLIENT_SECRET=your_abdm_client_secret_here
VITE_ABDM_SANDBOX=true

# Backend Server Configuration (for Google Fit integration)
BACKEND_URL=http://localhost:3000
SESSION_SECRET=your_session_secret_here

# Google OAuth (for Google Fit)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-fit/callback
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 UI/UX Features

### Design System
- **Glass Morphism**: Modern translucent design
- **Dark Theme**: Optimized for medical environments
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant with high contrast options

### Theme Customization
- Dynamic color schemes
- High contrast mode
- Large text options
- Reduced motion preferences

## 🔒 Security & Privacy

- **Data Encryption**: All health data encrypted in transit and at rest
- **FHIR Compliance**: Standardized medical data formats
- **ABDM Integration**: Government-approved health infrastructure
- **Local Processing**: Sensitive data processed locally when possible
- **Consent Management**: Granular privacy controls

## 📊 Clinical Validation

Health Scan implements clinically validated assessment protocols:

- **Digit Span Test**: Standardized memory assessment (WAIS-IV)
- **Word List Recall**: Gold standard for Alzheimer's screening
- **Stroop Test**: Attention and executive function evaluation
- **Finger Tapping**: Motor control assessment (UPDRS)
- **Voice Analysis**: Speech pattern evaluation for Parkinson's detection
- **PHQ-9**: Standardized depression screening tool
- **GAD-7**: Validated anxiety disorder screening
- **Heart Rate Variability**: Clinical-grade HRV analysis
- **Visual Acuity**: Standard Snellen chart testing

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint for code quality
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### **Owais Naeem** - Hardware Integration & AI Developer
- Machine learning algorithms for neurological analysis
- Backend API development
- Medical sensor data processing
- Hardware-AI integration

### **Himanshu Rathore** - Frontend, UX & IoT Developer
- Intuitive user interfaces
- Medical data visualization
- IoT device communication protocols
- Real-time monitoring systems

## 📞 Support

- **Documentation**: [docs/SETUP.md](docs/SETUP.md)
- **Deployment Guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/GeekLuffy/healthscan/issues)
- **Discussions**: [GitHub Discussions](https://github.com/GeekLuffy/healthscan/discussions)

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Other Platforms
The frontend is a standard React SPA and can be deployed to any static hosting service. For Google Fit integration, you'll need to deploy the backend server separately or use Vercel serverless functions (included in `/api` directory).

---

## 🎯 Use Cases

- **Primary Healthcare**: Early screening and detection in community health centers
- **Home Health Monitoring**: Personal health tracking and management
- **Chronic Disease Management**: Diabetes, hypertension, and cardiovascular monitoring
- **Mental Health Screening**: Depression and anxiety assessment
- **Preventive Care**: Regular health checkups and risk assessment
- **Research**: Data collection for health research (with proper consent)

## ⚠️ Important Notes

- **Not a Replacement for Medical Diagnosis**: Health Scan provides screening and monitoring tools but does not replace professional medical diagnosis
- **Privacy First**: All data processing happens locally on your device when possible
- **ABDM Integration**: Currently operates in sandbox mode for testing
- **Google Fit**: Requires backend server setup for full functionality

---

**Made with ❤️ for advancing comprehensive healthcare by Team ORBIT**