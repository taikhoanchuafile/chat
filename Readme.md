# 🚀 Authorization với Google

## 📌 Giới thiệu

Dự án này là ứng dụng MERN Stack cho phép người dùng thực hiện **authentication**,  
Mục tiêu: Tìm hiểu về **authentication** với Google - cấu trúc rõ ràng, tách service, middleware, controller đầy đủ.

---

## 🖼️ Demo / Screenshot

### **Demo**

https://authgg-fe.vercel.app/

### **Screenshot**

![demo1](./screenshots/demo1.PNG)
![demo1](./screenshots/demo2.PNG)

---

## 🛠️ Tech Stack

### Frontend

- React + TypeScript
- Vite
- Zustand (quản lý state)
- Axios + interceptor (refresh token)
- React Router DOM

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Bcrypt / Crypto (hash token)
- Cookie HttpOnly / refresh token
- OAuth / Google Auth

---

## 🧰 Công nghệ và khái niệm chính

### **OAuth 2.0 / Goole Auth**

- Đây là giao thức xác thực cho phép người dùng đăng nhập bằng tài khoản Google.
- Server nhận **credential** từ Google, BE xử lý thông tin và phản hồi **access token** để xác thực người dùng.
- Giúp ứng dụng không cần phải lưu tài khoản/mật khẩu người dùng.

### **JWT - JSON WEB TOKEN**

- Dùng để tạo token xác thực cho người dùng sau khi đăng nhập thành công. Gồm 2 loại:
- **Access Token:** token ngắn hạn(15-30 phút), dùng để xác thực các request đế server.
- **Refresh Token:** token dài hạn(7-30 ngày), dùng để cấp lại access token khi hết hạn.

### **Cooki HttpOnly**

- Lưu refresh token an toàn trên trình duyệt, **JS không thể truy cập**, tránh rủi ro XSS.

### **Node.js + Express.js**

- Backend tiếp nhận, xử lý, gửi phản hồi, cung cấp API xác thực.

### **MongoDB + Mongoose**

- Lưu thông tin user và refresh token.

---

## 🔄 Quy trình Login Google

**1. User click "Login with Google" trên frontend**

- FE hiện popup và gửi xác minh đến Google OAuth consent screen, nếu hợp lệ, người dùng chọn email đăng nhập.

**2. Google trả "authorization code"**

- FE nhận code và gửi lên BE để đổi lấy access token Google.

**3. BE xác thực credential mà FE gửi lên với Client_id (KEY console cloud google)**

- Nhận thông tin user (name, email, avatar, sub, email_verified,...).
- Nếu user chưa có trên Database thì tạo mới.

**4. BE tạo JWT**

- Tạo **access token** (ngắn hạn) gửi response về FE.
- Tạo **refresh token** (dài hạn) lưu trong MONGODB và gửi qua cookie về FE.

**5. FE sử dụng access token để gọi API**

- Nếu access token hết hạn thì FE gửi request lên BE(refresh-token) để nhận về access token mới mà không cần phải đăng nhập lại.

**6. Đăng xuất**

- BE sẽ xóa **refress token** trong MONGODB và cookies.
- Access token hết hạn tự động đăng xuất.

---

## 🚀 Cài đặt & Chạy dự án

### **1. Clone project**

```bash
git clone https://github.com/taikhoanchuafile/authgg.git
cd authgg
```

### **2.Backend setup**

```bash
cd backend
npm install
```

- Vào authgg/backend tạo file **_.env_**

```bash
PORT=5001
# port của api backend (http://localhost:PORT)

GOOGLE_CLIENT_ID=<client_id của Google>
# client_id lấy từ https://console.cloud.google.com/ .VD:xxxxxxxxxxxx-ap44gugk6d5m56husl04bqkohgi0bd35.apps.googleusercontent.com

MONGODB_URL=<url csdl của mongodb>
# Key URL mongodb. Vd:mongodb+srv:....@cluster0.jerdkbp.mongodb.net/devGG?appName=Cluster0

FRONTEND_URL=http://localhost:5173
#port frontend React

ACCESS_TOKEN_SECRET=<key access tokeb>
# VD:c39acd4a56d3a428767a9a5bd7f37a6b9ea40d1278401aeef (chuỗi bất kỳ)
```

- Chạy backend(/authgg/backend)

```base
npm run dev
```

### **3.Setup frontend**

```bash
cd ../frontend
npm install
```

- Vào authgg/frontend tạo file **_.env_**

```base
VITE_GOOGLE_CLIENT_ID=<client_id>
# VD: xxxxxxxxxxxx-ap44gugk6d5m56husl04bqkohgi0bd35.apps.googleusercontent.com

VITE_BACKEND_API_BASE_URL=http://localhost:5001/api
# Nếu PORT Backend thay đổi: http://localhost:<PORT>/api
```

- Chạy Frontend(/authgg/frontend)

```base
npm run dev
```

- Ctrl + Chuột trái vào URL: _http://localhost:5173_ để mở dự án trên trình duyệt

## 📄 License

Dự án phát hành theo giấy phép [MIT](./LICENSE).
