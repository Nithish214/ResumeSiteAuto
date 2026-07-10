# Resume Website — MERN Stack

A full-stack personal resume/portfolio site for Nithish Kumar, built with
React (Vite) on the frontend and Node.js/Express + MongoDB on the backend.
Includes a recruiter contact form that writes to MongoDB through a real API,
plus a lightweight admin dashboard for reviewing submissions.

---

## 1. Project Folder Structure

```
resume-website/
├── package.json                # root convenience scripts (run client+server together)
│
├── client/                     # React + Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── public/
│   │   └── ADD_YOUR_RESUME_HERE.txt   # drop resume.pdf here
│   └── src/
│       ├── main.jsx             # React entry point, wraps app in ThemeProvider + Router
│       ├── App.jsx              # route definitions (/ and /admin), wraps app in AuthProvider
│       ├── index.css            # Tailwind directives + design system classes
│       ├── context/
│       │   ├── ThemeContext.jsx # light/dark mode state + localStorage sync
│       │   └── AuthContext.jsx  # admin JWT state (login/logout/token)
│       ├── data/
│       │   └── resumeData.js    # ALL resume content lives here
│       ├── services/
│       │   └── api.js           # Axios client + API calls
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ThemeToggle.jsx  # animated light/dark switch
│       │   ├── Reveal.jsx       # framer-motion scroll-reveal wrapper
│       │   ├── Hero.jsx
│       │   ├── About.jsx
│       │   ├── Experience.jsx
│       │   ├── Skills.jsx
│       │   ├── Projects.jsx
│       │   ├── Education.jsx
│       │   ├── Contact.jsx      # recruiter contact form
│       │   └── Footer.jsx
│       └── pages/
│           ├── Home.jsx         # composes all sections above
│           └── Admin.jsx        # JWT-login-gated submissions dashboard + search
│
└── server/                      # Express + MongoDB backend
    ├── server.js                  # local dev entry point (app.listen)
    ├── lambda.js                  # AWS Lambda entry point (serverless-http)
    ├── app.js                     # the actual Express app - shared by both
    ├── serverless.yml             # AWS Lambda + API Gateway deploy config
    ├── package.json
    ├── .env.example
    ├── config/
    │   └── db.js                  # Mongoose connection (cached for Lambda)
    ├── models/
    │   └── Contact.js              # recruiter contact schema
    ├── controllers/
    │   ├── contactController.js    # create / list+search / get / delete logic
    │   └── authController.js       # admin login, issues JWTs
    ├── routes/
    │   ├── contactRoutes.js        # /api/contacts routes (list/get/delete are JWT-protected)
    │   └── authRoutes.js           # /api/auth/login
    ├── middleware/
    │   ├── validateContact.js      # express-validator rules
    │   ├── errorHandler.js         # centralized error responses
    │   └── auth.js                 # verifyToken - protects admin routes
    └── utils/
        ├── sendEmail.js            # nodemailer notification on new submissions
        └── generateAdminHash.js    # one-time script: `npm run hash-password`
```

---

## 2. Package Installation Commands

You need **Node.js 18+** and a running **MongoDB** instance (local or Atlas).

```bash
# From the resume-website/ root folder:

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Optional convenience: install `concurrently` at the root so you can run both
apps with a single command later:

```bash
# From resume-website/ root
npm install
```

---

## 3. Environment Variables (.env)

**server/.env** (copy from `server/.env.example`):
```
MONGO_URI=mongodb://127.0.0.1:27017/resume-website
PORT=5000
CLIENT_URL=http://localhost:5173

# Admin login (JWT) - see step-by-step setup below
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=
JWT_SECRET=

# Email notifications (optional) - see step-by-step setup below
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=
EMAIL_FROM_NAME=Resume Website
```

**client/.env** (copy from `client/.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```

Notice there's no admin password anywhere in the client's `.env` — admin
login now goes through a real backend endpoint instead of a value baked
into the browser bundle. Setting up the two pieces above:

**Admin login (required):**
1. Generate a bcrypt hash for whatever password you want to log in with:
   ```bash
   cd server
   npm run hash-password -- YourRealPassword
   ```
2. Copy the printed `ADMIN_PASSWORD_HASH=...` line into `server/.env`.
3. Set `ADMIN_USERNAME` to whatever username you want (e.g. `admin`).
4. Set `JWT_SECRET` to any long random string - generate one with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

**Email notifications (optional - skip to leave this off):**
1. On the Gmail account you want to send from, enable 2-Step Verification,
   then generate an "App Password" at myaccount.google.com/apppasswords
   (this is a 16-character password just for apps - not your real Gmail
   password).
2. Set `EMAIL_USER` to that Gmail address and `EMAIL_PASS` to the App
   Password.
3. Set `EMAIL_TO` to whichever inbox should receive notifications (can be
   the same address, or different).
4. Leaving these blank is fine - the contact form still works and still
   saves to MongoDB either way, it just won't email you about it.

---

## 4. Running Client and Server Locally

**Option A — two terminals (recommended while learning):**

```bash
# Terminal 1
cd server
npm run dev        # starts Express on http://localhost:5000

# Terminal 2
cd client
npm run dev        # starts Vite on http://localhost:5173
```

**Option B — one command from the root** (after `npm install` at the root):

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 5. How to Test the Contact Form Submission

**A. Through the UI**
1. Make sure MongoDB is running and the server started without errors
   (you should see `MongoDB connected: ...` and `Server running on
   http://localhost:5000` in the server terminal).
2. Go to http://localhost:5173, scroll to the contact section (or click
   "Contact Me").
3. Try submitting with empty fields first — you should see inline validation
   errors and no network request fires.
4. Fill in all fields validly and submit. You should see a loading spinner,
   then a success message.
5. Confirm it saved by visiting **http://localhost:5173/admin**, logging in
   with the username/password you set up in `ADMIN_USERNAME` /
   `ADMIN_PASSWORD_HASH`, and checking the submission appears. Try the
   search box too - it filters by name, company, email, or role.

**B. Directly against the API (useful for backend-only testing)**

```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "recruiterName": "Jane Doe",
    "companyName": "Acme Corp",
    "workEmail": "jane@acme.com",
    "phoneNumber": "+353 1 234 5678",
    "jobTitle": "Senior SRE",
    "message": "We have a role that matches your background.",
    "preferredCallbackTime": "Weekdays after 3pm"
  }'
```

Then list submissions:
```bash
curl http://localhost:5000/api/contacts
```

---

## 6. How to Deploy the MERN App

**Database — MongoDB Atlas**
1. Create a free cluster at mongodb.com/atlas.
2. Create a database user and allow network access (or `0.0.0.0/0` for
   simplicity while learning).
3. Copy the connection string into your production `MONGO_URI`.

**Backend — Render / Railway / Fly.io (traditional Node host)**
1. Push the `server/` folder as its own deployable service (or point the
   host at the repo root with `server` as the working directory).
2. Set environment variables in the host's dashboard: `MONGO_URI`, `PORT`
   (most hosts set this automatically), `CLIENT_URL` (your deployed
   frontend URL), `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`,
   and the `EMAIL_*` vars if you want notifications.
3. Build/start command: `npm install && npm start`.

**Backend — AWS Lambda (serverless)**

The backend is already structured for this: `app.js` holds the Express app,
`lambda.js` wraps it with `serverless-http` for Lambda, and `serverless.yml`
defines the AWS resources. `server.js` (used by `npm run dev`) is untouched
and keeps working exactly as before for local development.

1. Install the AWS CLI and run `aws configure` with credentials that can
   create Lambda functions, an HTTP API, and an IAM role.
2. Make sure `server/.env` has your real `MONGO_URI` (must be MongoDB Atlas
   or another internet-reachable MongoDB — Lambda can't reach a database
   running on your own laptop), `CLIENT_URL` set to your deployed
   frontend's URL, and `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`/`JWT_SECRET`
   filled in (admin login won't work on the deployed site otherwise — these
   get read into the Lambda's environment automatically via
   `serverless.yml`, same as `MONGO_URI`). Add the `EMAIL_*` vars too if you
   want notification emails to work once deployed.
3. From `server/`:
   ```bash
   npm install
   npx serverless deploy
   ```
4. The deploy output prints an HTTP API endpoint URL, e.g.
   `https://abc123xyz.execute-api.eu-west-1.amazonaws.com`. Test it:
   ```bash
   curl https://abc123xyz.execute-api.eu-west-1.amazonaws.com/api/contacts
   ```
5. Set that URL (plus `/api`) as `VITE_API_URL` in `client/.env` and rebuild
   the frontend.
6. Want a local preview of the Lambda + API Gateway setup before deploying?
   `npx serverless offline` runs it locally without touching AWS.
7. To tear everything down later: `npx serverless remove`.

> **On MONGO_URI as a plain env var:** this is fine for learning, but for a
> real production secret, consider moving it into AWS Secrets Manager or
> SSM Parameter Store and fetching it in `lambda.js` at cold start instead
> of storing it directly in the Lambda's environment configuration.

**Frontend — Vercel / Netlify**
1. Set the project root to `client/`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set environment variables: `VITE_API_URL` (your deployed backend URL +
   `/api`). That's the only one the frontend needs now — admin credentials
   live entirely on the backend.
4. Deploy — Vercel/Netlify will give you a public URL.

**Frontend — AWS S3 + CloudFront (pairs naturally with a Lambda backend)**
1. `cd client && npm run build` — produces static files in `client/dist`.
2. Create an S3 bucket, enable static website hosting (or keep it private
   and serve exclusively through CloudFront, which is the more secure
   option), and upload the contents of `dist/`.
3. Create a CloudFront distribution pointing at the bucket for HTTPS and
   caching.
4. Set `VITE_API_URL` to your Lambda API's URL before running `npm run
   build`, since Vite bakes environment variables into the build at
   build time (there's no separate runtime config step for static hosting).

**After deploying (either combination):** update the backend's `CLIENT_URL`
to match your live frontend domain so CORS allows requests from it, then
redeploy the backend (`npx serverless deploy` for Lambda, or your host's
normal redeploy step).

---

## 7. Suggestions for Future Improvements

- **Spam protection**: add `express-rate-limit` to `/api/contacts` and/or a
  honeypot field to cut down on automated spam submissions.
- **Pagination**: paginate `GET /api/contacts` once submissions grow past a
  page or two - the search feature helps in the meantime.
- **Automated tests**: add Jest/Supertest tests for the API and
  React Testing Library tests for the contact form.
- **CMS-style content**: move `resumeData.js` into MongoDB with its own
  admin-editable UI, so content updates don't require a redeploy.
- **Analytics**: track which projects/sections recruiters engage with most.
- **CI/CD**: add a GitHub Actions workflow to run lint/tests and deploy on
  merge to main.

---

## Design Notes

The visual language draws from cloud monitoring/observability dashboards —
a fitting fit for a Cloud Ops/SRE resume. The signature element is the
"system status" panel in the hero (an "available" pulse indicator next to
live-feeling stats), echoed subtly in the nav logo and footer. Monospace
type (JetBrains Mono) is reserved for data, labels and timestamps; Sora
handles headings; Inter carries body text. Both light and dark themes are
fully supported via Tailwind's class-based dark mode.
