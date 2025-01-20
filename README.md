# Social Media Gallery Application

## 🌟 Live Demo
- Frontend: [https://socialmediain.netlify.app](https://socialmediain.netlify.app)
- Backend API: [https://social-media-backend-0fm0.onrender.com](https://social-media-backend-0fm0.onrender.com)

## 🎯 Project Overview
A full-stack social media gallery application that allows users to share their social media profiles along with multiple images. Built with modern web technologies and deployed on cloud platforms.

## ⚡ Key Features
- Multi-image upload capability
- Social media profile submission
- Real-time gallery updates
- Responsive design
- Cloud image storage
- Secure database management

## 🛠️ Tech Stack
### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- Environment variable management

### Backend
- Node.js
- Express.js
- PostgreSQL (Supabase)
- Cloudinary for image storage
- CORS enabled
- Environment variable protection

### DevOps
- Frontend deployed on Netlify
- Backend hosted on Render
- Database hosted on Supabase
- Continuous Deployment enabled

## 🔧 Installation & Setup
1. Clone the repository
```bash
git clone https://github.com/SamarthKasar123/social-media-project
```

2. Install dependencies for backend
```bash
cd social-media-backend
npm install
```

3. Install dependencies for frontend
```bash
cd social-media-frontend
npm install
```

4. Create .env files:

Backend `.env`:
```env
DATABASE_URL=your_database_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
```

Frontend `.env`:
```env
REACT_APP_API_URL=your_backend_url
```

5. Run the development servers:

Backend:
```bash
npm start
```

Frontend:
```bash
npm start
```

## 📱 Application Flow
1. User fills out the form with their name and social media handle
2. Selects multiple images for upload
3. Images are stored in Cloudinary
4. Profile information and image URLs are stored in PostgreSQL
5. Gallery updates in real-time with the new submission

## 🔐 Security Features
- Environment variables for sensitive data
- Secure database connection
- Image upload size limitations
- CORS protection
- SSL enabled endpoints

## 💡 Future Enhancements
- User authentication
- Image editing capabilities
- Social media integration
- Comment system
- Like/Share functionality

## 🤝 Contributing
Feel free to fork this project and submit pull requests. You can also open issues for bugs or feature requests.

## 📜 License
This project is licensed under the ISC License

## 👨‍💻 Author
Samarth Manik Kasar
- GitHub: https://github.com/SamarthKasar123
- LinkedIn: https://www.linkedin.com/in/samarth-kasar/
