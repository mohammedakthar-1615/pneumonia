# 🚀 Quick Start Guide - Pneumonia AI Detection System

## System Overview

Three-service architecture:
1. **Frontend** (React + Vite) - Port 5173
2. **Backend** (Express.js) - Port 5000
3. **ML Service** (Flask) - Port 5001

---

## ⚡ Starting All Services

### Method 1: Individual Terminals (Recommended for Development)

**Terminal 1 - Client**
```bash
cd /home/jarvis/Documents/pneumonia/client
npm run dev
```
→ Opens at http://localhost:5173

**Terminal 2 - Server**
```bash
cd /home/jarvis/Documents/pneumonia/server
npm start
```
→ Running on http://localhost:5000

**Terminal 3 - ML Service**
```bash
cd /home/jarvis/Documents/pneumonia/ml-service
source .venv/bin/activate
python app.py
```
→ Running on http://localhost:5001

### Method 2: Concurrent (if using concurrently)

```bash
cd /home/jarvis/Documents/pneumonia
npm run dev:all  # if configured
```

---

## 📱 Application Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Landing page with CTA |
| `/predict` | Predict | Upload X-ray for analysis |
| `/history` | History | View all patient records |
| `/about` | About | Learn about pneumonia |
| `/precautions` | Precautions | Prevention & care guide |
| `/dashboard` | Dashboard | Analytics (if applicable) |

---

## 🎯 Key Features

### 1. X-Ray Prediction
- Upload chest X-ray image
- AI analyzes using DenseNet121 model
- Shows result: Normal or Pneumonia
- Displays confidence score

### 2. Patient History
- Search patients by name
- Filter by result type
- Sort by date or name
- View statistics
- Table view (desktop) / Card view (mobile)

### 3. Education Pages
- **About**: Comprehensive pneumonia information
- **Precautions**: Prevention, symptoms, recovery tips

### 4. Modern UI
- Dark theme with purple/cyan accents
- Smooth animations and transitions
- Fully responsive design
- Professional styling

---

## 🛠️ Common Tasks

### View Predictions
1. Go to http://localhost:5173
2. Click "Predict" button
3. Upload chest X-ray image
4. Wait for analysis
5. View result and confidence

### Check Patient History
1. Click "History" in navbar
2. Browse all patient records
3. Search by patient name
4. Filter by result type
5. Sort by date or name

### Update Colors/Theme
Edit `/client/src/App.css`:
```css
:root {
  --primary: #7c3aed;      /* Change primary color */
  --accent: #06b6d4;       /* Change accent color */
  /* Update other colors as needed */
}
```

### Add New Page
1. Create component in `/client/src/pages/NewPage.jsx`
2. Import in `/client/src/App.jsx`
3. Add route: `<Route path="/new" element={<NewPage />} />`
4. Add nav link in `/client/src/components/common/Navbar.jsx`

### Debug API Issues
1. Check server running: `http://localhost:5000/health`
2. Check ML service running: `http://localhost:5001/health`
3. Open browser console (F12) for error messages
4. Check Network tab for API calls

---

## 📁 Important Files

### Frontend
- `App.jsx` - Main app with routes
- `App.css` - Global styles + design variables
- `Navbar.jsx` - Navigation component
- `pages/` - All page components
- `components/` - Reusable components
- `services/api.js` - API calls

### Backend
- `server/index.js` - Express server setup
- `server/routes/patientRoutes.js` - Patient endpoints
- `server/controllers/patientController.js` - Route handlers
- `server/models/Patient.js` - MongoDB schema

### ML Service
- `ml-service/app.py` - Flask API
- `ml-service/model/predict.py` - Prediction logic
- `ml-service/model/pneumonia_model_final.h5` - Pre-trained model

---

## 🔍 Troubleshooting

### "Cannot GET /" Error
→ Check client is running on port 5173  
→ Run: `npm run dev` in client folder

### "Connection refused" on upload
→ Check server running on port 5000  
→ Run: `npm start` in server folder

### "ML service not responding"
→ Check Flask app running on port 5001  
→ Run: `python app.py` in ml-service folder

### Predictions not showing
→ Check all three services running  
→ Check browser console for errors (F12)  
→ Verify image is valid X-ray format

### Styling looks wrong
→ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)  
→ Check CSS files are loading (DevTools → Network)  
→ Verify App.css imports correctly

### Mobile layout broken
→ Test with responsive design mode (F12)  
→ Check media queries in CSS files  
→ Verify breakpoints: 480px, 768px, 1024px

---

## 📊 API Endpoints

### Patient Endpoints
```
GET    /api/patients              # Get all patients
GET    /api/patients/:id          # Get single patient
POST   /api/patients              # Create patient
PUT    /api/patients/:id          # Update patient
DELETE /api/patients/:id          # Delete patient
```

### ML Service Endpoints
```
POST   /predict                   # Predict from image
GET    /health                    # Service health check
```

---

## 🔐 Environment Setup

### Required Environment Variables

**Server (.env)**
```
MONGODB_URI=mongodb://localhost:27017/pneumonia
PORT=5000
ML_SERVICE_URL=http://localhost:5001
```

**ML Service (.env)**
```
MODEL_PATH=./model/pneumonia_model_final.h5
DEBUG=False
PORT=5001
```

---

## 📈 Performance Tips

1. **Clear browser cache**: Ctrl+Shift+Del
2. **Check network tab**: DevTools → Network
3. **Monitor CPU usage**: Open Task Manager
4. **Profile with Lighthouse**: DevTools → Lighthouse
5. **Check console errors**: DevTools → Console

---

## 🎨 CSS Quick Reference

### Color Variables (in App.css :root)
```css
--primary: #7c3aed;        /* Purple */
--accent: #06b6d4;         /* Cyan */
--success: #14b8a6;        /* Green */
--danger: #fb7185;         /* Red */
--warning: #f59e0b;        /* Orange */
--dark-bg: #0f172a;        /* Dark blue-gray */
--light-text: #f1f5f9;     /* Light blue-gray */
```

### Spacing System
```css
8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px, 48px, 60px, 80px
```

### Typography Scales
```css
H1: 2-3.2rem (responsive)
H2: 1.6-2rem (responsive)
H3: 1.1-1.3rem
Body: 0.95-1.05rem
```

---

## 🚀 Deployment Preparation

### Build for Production
```bash
cd /home/jarvis/Documents/pneumonia/client
npm run build
```
Output: `client/dist/` folder

### Test Production Build
```bash
npm run preview
```
Opens at http://localhost:4173

### Deploy Steps
1. Build client: `npm run build`
2. Copy `dist/` to production server
3. Configure environment variables
4. Start backend services
5. Point domain to production server

---

## 📞 Support Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Express Docs**: https://expressjs.com
- **Flask Docs**: https://flask.palletsprojects.com
- **MongoDB Docs**: https://docs.mongodb.com
- **TensorFlow Docs**: https://www.tensorflow.org

---

## ✅ Verification Checklist

After starting services, verify:

- [ ] Client loads at http://localhost:5173
- [ ] Navbar visible with all 5 links
- [ ] Home page shows landing content
- [ ] Predict page shows upload interface
- [ ] History page loads patient list
- [ ] About page shows info cards
- [ ] Precautions page shows health tips
- [ ] No console errors (F12)
- [ ] Responsive design works (mobile view)
- [ ] All animations smooth

---

## 💡 Tips & Tricks

1. **Hot reload enabled**: Changes save automatically in dev mode
2. **React DevTools**: Install browser extension for debugging
3. **Network tab**: Monitor API calls in DevTools
4. **Console**: Use `console.log()` for debugging
5. **Breakpoints**: Click line numbers to debug in DevTools
6. **Mobile testing**: Use DevTools responsive mode (F12 → Toggle device toolbar)

---

## 🎯 Next Steps

1. ✅ Verify all services running
2. ✅ Test navigation between pages
3. ✅ Upload test image and verify prediction
4. ✅ Check History page loads data
5. ✅ Review responsive design on mobile
6. ✅ Customize colors/styling if needed
7. ✅ Deploy to production

---

**Status**: ✅ Ready to Use  
**Last Updated**: 2024  
**Questions?** Check TESTING_GUIDE.md or UI_IMPLEMENTATION_GUIDE.md for detailed information
