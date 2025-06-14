# 🏋️‍♂️ Fitness Form Analyzer

A cutting-edge web application that uses AI to analyze and improve your workout form in real-time. Built with modern technologies to help fitness enthusiasts perfect their technique and prevent injuries.

![Fitness Form Analyzer](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.10.0-orange)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green)

## ✨ Features

### 🤖 AI-Powered Form Analysis
- Real-time pose detection using TensorFlow.js and MoveNet
- Instant feedback on exercise form
- Accuracy scoring for each movement
- Detailed pose keypoint visualization

### 📊 Comprehensive Dashboard
- Track your progress over time
- View exercise history and performance metrics
- Filter and sort sessions by exercise type
- Export data for detailed analysis
- Interactive charts and statistics

### 🔐 User Management
- Secure authentication system
- Personalized user profiles
- Session history tracking
- Progress monitoring

### 🎥 Video Analysis
- Upload workout videos
- Real-time form analysis
- Frame-by-frame pose detection
- Visual feedback with skeleton overlay

## 🚀 Tech Stack

### Frontend
- React.js for dynamic UI
- TensorFlow.js for pose detection
- Recharts for data visualization
- Tailwind CSS for modern styling
- Axios for API communication

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- RESTful API architecture

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitness-form-analyzer.git
cd fitness-form-analyzer
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# In server directory, create .env file
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the application:
```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm start
```

## 📱 Usage

1. **Create an Account**
   - Sign up with your email
   - Set up your profile

2. **Record Your Workout**
   - Upload a video of your exercise
   - Select the exercise type
   - Start the analysis

3. **Get Instant Feedback**
   - View real-time form analysis
   - See accuracy scores
   - Get improvement suggestions

4. **Track Progress**
   - Monitor your improvement over time
   - Compare different sessions
   - Export your data

## 🔍 How It Works

1. **Video Processing**
   - Upload workout videos
   - System processes each frame
   - AI detects body keypoints

2. **Form Analysis**
   - Compare detected poses with ideal form
   - Calculate accuracy scores
   - Generate feedback

3. **Data Storage**
   - Save session data
   - Track progress
   - Generate insights

## 🎯 Benefits

- **Prevent Injuries**: Get instant feedback on your form
- **Improve Technique**: Learn proper exercise execution
- **Track Progress**: Monitor your improvement over time
- **Stay Motivated**: Visual feedback and progress tracking
- **Professional Guidance**: AI-powered form analysis

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow.js team for the pose detection model
- React team for the amazing frontend framework
- MongoDB for the database solution
- All contributors who have helped shape this project

## 📞 Contact

Your Name - Prathamesh Gharat
Project Link: https://github.com/TechFox6905/fitness-form-analyzer.git

---

⭐️ If you like this project, please give it a star on GitHub! 
