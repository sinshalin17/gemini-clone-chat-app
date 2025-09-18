
# Gemini Clone Chat App

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application. This project simulates OTP login, chatroom management, AI messaging, image uploads, and a variety of modern UX/UI features.

## Live Link

> [Replace with your deployed Vercel/Netlify URL]

## Features

### Authentication
- OTP-based Login/Signup flow using country codes
- Fetch country data from restcountries.com
- Simulate OTP send/validation with setTimeout
- Form validation using React Hook Form + Zod

### Dashboard
- List of user’s chatrooms
- Create/Delete chatrooms
- Toast notifications for actions

### Chatroom Interface
- User and simulated AI messages
- Timestamps
- Typing indicator ("Gemini is typing...")
- Fake AI reply after a delay (setTimeout)
- Throttling Gemini responses
- Auto-scroll to latest message
- Reverse infinite scroll (dummy data)
- Client-side pagination (e.g., 20 per page)
- Image upload in chat (base64/preview URL)
- Copy-to-clipboard on message hover

### Global UX Features
- Mobile Responsive Design
- Dark Mode Toggle
- Debounced search bar to filter chatrooms
- Save auth & chat data using localStorage
- Loading skeletons for chat messages
- Toast notifications for key actions
- Keyboard accessibility for all main interactions

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **State Management:** Zustand
- **Form Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS
- **Deployment:** Vercel or Netlify

## Setup & Run Instructions

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Run the development server:**
	```bash
	npm run dev
	```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Folder/Component Structure
- `/app/auth.tsx` – Authentication (OTP, country code)
- `/app/dashboard/page.tsx` – Dashboard (chatroom list, create/delete)
- `/app/chatroom/[id].tsx` – Chatroom interface (AI, messages, features)
- `/app/layout.tsx` – Global layout, dark mode toggle
- `/app/globals.css` – Global styles

## Implementation Notes
- **Throttling, pagination, infinite scroll, and form validation** are implemented client-side with React state and hooks.
- **AI responses** are simulated with setTimeout and throttling.
- **Image upload** uses base64/preview URL (no backend).
- **All data is stored in local state/localStorage for demo purposes.**

## Screenshots
> [Add screenshots here if desired]

## Deployment
- Deploy to Vercel or Netlify. Ensure environment is production-ready.

---

### For more details, see the assignment PDF.
