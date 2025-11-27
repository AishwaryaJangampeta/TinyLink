# TinyLink – URL Shortener
TinyLink is a simple full-stack URL shortener application.  
Users can create short links, view all links, check stats, and open redirects.

## Live Project

**Frontend:**  
https://tinylink-aj.vercel.app

**Backend API:**  
https://tinylink-backend-xc2a.onrender.com

## Steps to Use

1. Open the TinyLink website:  
   https://tinylink-aj.vercel.app

2. Enter any long URL (example: https://google.com)

3. (Optional) Enter a custom short code  
   Example: `hello1`

4. Click **Shorten**

5. Your short link will appear in the list below.

6. Click **Copy** to copy the short link.

7. Paste the copied link into a new browser tab:  
   It should redirect to the original website.

8. Click **Stats** to see:
   - total clicks  
   - last clicked time  
   - created date  

9. Click **Delete** to remove a link.


## Features
- Create short URLs 
- Redirect using short code
- View all created links
- View link statistics
- Delete links
- Simple and clean UI


## Tech Stack
**Frontend:** HTML, CSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** PostgreSQL 

## API Endpoints

- `POST /api/links` – Create new short link  
- `GET /api/links` – List all links  
- `GET /api/links/:code` – Get link stats  
- `DELETE /api/links/:code` – Delete link  
- `GET /:code` – Redirect to the original URL  
- `GET /healthz` – Health check  

## Database Table

```sql
CREATE TABLE links (
  code VARCHAR(8) PRIMARY KEY,
  target_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  last_clicked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Project Structure

TinyLink/
    backend/
    frontend/
    README.md
    .gitignore