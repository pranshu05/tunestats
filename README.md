# TuneStats 🎵

**TuneStats** is a web application that allows users to track their Spotify stats, share their profiles, and compare their music taste with friends.

## 🚀 Features

- **Spotify Authentication**: Securely log in with your Spotify account.
- **Sharable User Profiles**: Generate personalized, shareable profiles for showcasing your Spotify activity.
- **Friend Comparable Charts**: Compare your Spotify stats with friends in personalized charts.
- **Add Friends**: Build a network of friends and explore their music preferences.
- **Privacy Control**: Set your profile as public or private based on your preference.
- **Responsive Design**: Enjoy a seamless experience across all devices.
- **Artist Page**: View detailed information about your favorite artists.
- **Track Page**: Explore detailed insights about your top tracks.

---

## 🛠️ Getting Started

Follow these steps to set up TuneStats on your local machine:

### Prerequisites

Make sure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- Firebase account for database configuration
- Spotify Developer account to set up API credentials


### File Structure
```
root/
├── public/           # Static assets
├── src/              # Source code
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── styles/       # CSS and styling
│   ├── utils/        # Utility functions
│   └── hooks/        # Custom hooks
├── .env.local        # Environment variables
├── package.json      # Dependencies and scripts
├── README.md         # Project documentation
└── next.config.js    # Next.js configuration
```


### Installation

1. **Fork the Repository**
   Click the `Fork` button on the top right of this repository to create your copy.

2. **Clone the Repository**
   Clone your forked repo to your local machine:
   ```bash
   git clone https://github.com/pranshu05/tunestats.git
   cd tunestats
   ```

3. **Install Dependencies**
   Install the required packages using npm or yarn:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the root directory and configure the following environment variables:
   ```env
    SPOTIFY_CLIENT_SECRET = 
    SPOTIFY_CLIENT_ID = 
    FIREBASE_API_KEY = 
    FIREBASE_AUTH_DOMAIN = 
    FIREBASE_PROJECT_ID = 
    FIREBASE_STORAGE_BUCKET = 
    FIREBASE_MESSAGING_SENDER_ID = 
    FIREBASE_APP_ID = 
    NEXTAUTH_URL = 
   ```

5. **Run the Development Server**
   Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

6. **Open in Browser**
   Open http://localhost:3000 to view the app.

---

## 🤝 Contribution Guidelines

We welcome contributions! Follow these steps to contribute:

1. **Fork the Repository**
   Click the `Fork` button on the top right of this repository to create your copy.

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/<feature-name>
   ```

3. **Make Your Changes**
   Add your changes and commit:
   ```bash
   git add .
   git commit -m "Add <feature-name>"
   ```

4. **Push Your Changes**
   ```bash
   git push origin feature/<feature-name>
   ```

5. **Open a Pull Request**
   Go to the original repository and open a pull request describing your changes.

---


## 📬 Community and Support

- Join our [Discord Server](https://discord.gg/example) for discussions and support.
- Follow us on [Twitter](https://twitter.com/example) for updates.
- Report issues or feature requests via [GitHub Issues](https://github.com/pranshu05/tunestats/issues).

---


## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### 🌟 Support

If you like this project, please give it a star ⭐ and share it with your friends!
