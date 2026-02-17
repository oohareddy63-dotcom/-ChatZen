# 🤖 ConnectNow - AI-Powered Conversational Platform

A modern, intelligent conversational platform built with cutting-edge web technologies. ConnectNow provides seamless AI-powered interactions with a beautiful, responsive interface and robust backend infrastructure.

## 🚀 Features

- **💬 Intelligent Conversations**: Real-time AI-powered messaging
- **🎨 Modern Interface**: Clean, intuitive user experience
- **🗄️ Cloud Storage**: Persistent data with MongoDB Atlas
- **🤖 AI Integration**: Advanced language model capabilities
- **📱 Responsive Design**: Optimized for all devices
- **⚡ Real-time Responses**: Instant message streaming
- **🔄 Conversation Management**: Create, organize, and manage discussions
- **🌙 Dark Theme**: Professional dark mode interface

## 🛠️ Tech Stack

### Frontend Technologies
- **React 18** - Modern UI framework with hooks and context
- **Vite** - High-performance build tool and development server
- **JavaScript ES6+** - Modern JavaScript with async/await patterns
- **CSS3** - Advanced styling with animations and transitions
- **React Markdown** - Rich text rendering for formatted responses
- **React Spinners** - Elegant loading animations
- **Highlight.js** - Professional code syntax highlighting
- **UUID** - Secure unique identifier generation

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB Atlas** - Scalable cloud-hosted NoSQL database
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **AI Language Models** - Advanced natural language processing
- **CORS** - Secure cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Automated development server restarts

### Development Tools
- **PowerShell** - Command-line interface (Windows)
- **Git** - Version control system
- **VS Code** - Integrated development environment

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Atlas** account (for cloud database)
- **AI Service API** key (for language model integration)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ConnectNow
```

### 2. Install Dependencies

**Backend Dependencies:**
```bash
cd Backend
npm install
```

**Frontend Dependencies:**
```bash
cd ../Frontend
npm install
```

### 3. Environment Configuration

# Server Port
PORT=8080

# Optional: Local AI Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### 4. Start the Application

**Start Backend Server:**
```bash
cd Backend
npm run dev
```

**Start Frontend Server:**
```bash
cd Frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

## 🏗️ Project Structure

```
ConnectNow/
├── Backend/
│   ├── models/
│   │   └── Thread.js          # MongoDB schema
│   ├── routes/
│   │   └── chat.js           # API routes
│   ├── utils/
│   │   ├── fileDB.js         # Fallback database
│   │   └── openai.js         # AI integration
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express server
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx       # Main application
│   │   │   ├── Chat.jsx      # Chat messages
│   │   │   ├── ChatWindow.jsx # Chat interface
│   │   │   └── Sidebar.jsx   # Thread management
│   │   ├── App.css           # Global styles
│   │   ├── ChatWindow.css    # Chat interface styles
│   │   ├── Chat.css          # Message styles
│   │   ├── Sidebar.css       # Sidebar styles
│   │   └── MyContext.jsx     # React Context
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
└── README.md                 # This file
```

## 🔧 API Endpoints

### Conversation Management
- `GET /api/thread` - Retrieve all conversation threads
- `GET /api/thread/:threadId` - Get specific thread messages
- `POST /api/chat` - Send message and receive AI response
- `DELETE /api/thread/:threadId` - Delete a conversation thread

### System Testing
- `POST /api/test` - Test database connectivity

## 🎨 UI Components

### ChatWindow
- Modern dark theme interface
- Real-time message input
- User profile management
- Responsive design patterns

### Sidebar
- Conversation thread listing
- New conversation creation
- Thread deletion functionality
- Active thread highlighting

### Chat Messages
- User and AI message styling
- Rich text rendering
- Code syntax highlighting
- Streaming text animations

## 🗄️ Database Schema

### Thread Model
```javascript
{
  threadId: String,      // Unique thread identifier
  title: String,          // Thread title (first message)
  messages: [{
    role: String,         // 'user' or 'assistant'
    content: String,      // Message content
    timestamp: Date       // Message timestamp
  }],
  createdAt: Date,        // Thread creation time
  updatedAt: Date         // Last update time
}
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `AI_API_KEY` | AI service API key for language model | ✅ |
| `PORT` | Backend server port | ❌ (default: 8080) |
| `OLLAMA_URL` | Local AI service URL | ❌ (optional) |
| `OLLAMA_MODEL` | Local AI model name | ❌ (optional) |

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Database Fallback**: File-based storage if MongoDB fails
- **AI Service Fallback**: Demo responses if API is unavailable
- **CORS Configuration**: Secure cross-origin setup
- **Input Validation**: API request validation
- **Graceful Degradation**: App remains functional during partial failures

## 📱 Responsive Design

- **Desktop**: Full sidebar + chat interface
- **Tablet**: Collapsible sidebar design
- **Mobile**: Hidden sidebar with menu toggle
- **Touch Support**: Optimized for mobile interactions

## 🔄 Development Workflow

1. **Backend Development**: `npm run dev` in Backend directory
2. **Frontend Development**: `npm run dev` in Frontend directory
3. **Database Setup**: Configure MongoDB Atlas
4. **AI Integration**: Add AI service API key
5. **Testing**: Use browser dev tools and API testing tools

## 🚀 Production Deployment

### Backend Deployment
1. Configure production environment variables
2. Use PM2 or similar process manager
3. Set up reverse proxy (nginx)
4. Configure SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request



## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify MongoDB Atlas credentials
- Ensure IP address is whitelisted
- Check database user permissions

**AI Service Not Responding**
- Validate API key credentials
- Check service account credits
- Verify API endpoint configuration

**Frontend Loading Issues**
- Confirm backend is running on port 8080
- Verify CORS configuration
- Check browser console for errors

**Build Process Errors**
- Clear node_modules and reinstall dependencies
- Verify Node.js version compatibility
- Check all dependencies are properly installed


---

**Built with ❤️ using modern web technologies**
