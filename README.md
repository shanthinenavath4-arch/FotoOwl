# 🦉 FotoOwl

FotoOwl is a modern mobile photography gallery application built using React Native, Expo, TypeScript, Zustand, and AsyncStorage.

The application allows users to register and log in locally, explore photography images from the Picsum Photos API, search and filter images, manage favorites, view image details, download images to the device gallery, and edit their profile.

---

## 📱 Application Overview

FotoOwl provides a clean and responsive experience for discovering photography.

### Main Screens

- Login
- Register
- Explore / Home
- Favorites
- Image Details
- Profile

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- Local authentication using AsyncStorage
- Persistent login session
- Logout
- Form validation
- Email validation
- Mobile number validation
- Password validation
- Confirm password validation
- Required field validation

### Registration Fields

- Full Name
- Email
- Gender
- Mobile Number
- Address
- City
- Password
- Confirm Password

### Validation Rules

- All required fields must be filled
- Email must have a valid format
- Mobile number must contain exactly 10 digits
- Password must contain at least 6 characters
- Password and Confirm Password must match

---

## 🖼️ Explore Gallery

The Home / Explore screen displays photography images fetched from the Picsum Photos API.

API endpoint:

```text
https://picsum.photos/v2/list?page=1&limit=50