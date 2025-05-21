# DotByDot

**Bridging the Braille Literacy Gap Through Accessible AI-Powered Education**

---

## Inspiration

Global braille literacy rates are at a historic low, with only 1 in 10 visually impaired individuals able to read braille. Existing braille keyboards are often prohibitively expensive and have steep learning curves. 

We were inspired to create a solution that tackles this gap by combining **intuitive design** with **accessible hardware**. Our goal: to make braille education both **obtainable** and **engaging** for learners worldwide.

---

## What It Does

**DotByDot** is an adaptive web platform for learning braille through gamified lessons and personalized tests.

### Key Features

- **Accessibility-First Approach**  
  Semantic HTML, ARIA attributes, and full keyboard navigability ensure a screen-reader-friendly experience.

- **Global i18n Support**  
  Easily switches between languages to support worldwide learners.

- **AI-Powered Adaptation**  
  Integrates Google Gemini AI to dynamically adjust lesson difficulty based on user performance.

- **Custom Hardware Integration**  
  A low-cost braille keyboard built from tactile switches and PCBs, plus an LCD prototype simulating refreshable braille cells.

---

## How We Built It

- **Frontend**:  
  Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/), styled using [Tailwind CSS](https://tailwindcss.com/) with a strong focus on accessibility.

- **Backend & AI**:  
  Developed with [FastAPI](https://fastapi.tiangolo.com/) and [Python](https://www.python.org/). Used [Google Gemini AI](https://deepmind.google/discover/blog/google-gemini/) to generate and adapt content.

- **Database**:  
  Leveraged [AWS DynamoDB](https://aws.amazon.com/dynamodb/) for storing user data and progress.

- **Hardware**:  
  Designed and built a custom braille keyboard with tactile switches and PCBs. Prototyped a refreshable braille cell using an LCD display.

---

## Challenges We Faced

- **Accessibility Compliance**:  
  Creating a consistent screen-reader-friendly and fully keyboard-navigable UI was challenging but critical.

- **Hardware Integration**:  
  Seamlessly connecting our physical braille keyboard to the web platform posed unexpected interface issues.

- **AI Adaptation**:  
  Fine-tuning Gemini AI to accurately reflect real-time user progress was a complex, rewarding task.

- **Localization**:  
  Managing multilingual content dynamically while maintaining context and usability.

---

## Accomplishments

- **True Accessibility**: Integrated both hardware and software accessibility in a meaningful way.
- **Low-Cost Hardware Prototype**: Designed a cost-effective braille keyboard with refreshable cell concepts using university resources.
- **AI-Driven Personalization**: Used Gemini AI to adapt lesson difficulty in real time.
- **Global Reach**: Implemented internationalization and localization for multi-language support.

---

## What We Learned

- **Hardware-Software Synergy**: Understanding the bridge between physical devices and digital platforms for accessibility.
- **Adaptive Learning Algorithms**: How AI can personalize educational experiences dynamically.
- **Inclusive Design Principles**: Deepened our skills in ARIA, semantic HTML, and accessibility testing.
- **Scalable Localization**: Managed translation files and live language switching for a global audience.

---

## What’s Next for DotByDot

- **Braille Display Innovation**: Expand our LCD prototype into functional, open-source refreshable braille modules.
- **Enhanced AI**: Improve AI-driven lesson generation with richer datasets and smarter logic.
- **Open Source Hardware**: Enable the community to contribute and build customized hardware solutions.
- **Broader Language Support**: Expand i18n to include more languages and braille systems worldwide.

---

## Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Python](https://www.python.org/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [Gemini AI](https://deepmind.google/discover/blog/google-gemini/)
- [next-intl](https://github.com/amannn/next-intl)
- [Google Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [TypeScript](https://www.typescriptlang.org/)

---

## Contact

For questions or collaboration ideas, feel free to reach out via GitHub Issues or open a discussion!

---
## DevPost

- [DevPost Link](https://devpost.com/software/dotbydot)
---

# DotByDot API Documentation

This document outlines the API routes for DotByDot, including endpoint definitions, expected parameters, and placeholder descriptions for each route. The "User Object Schema" section shows an example of the data structure stored in the database.

---

## Setup
pip install bcrypt boto3 "fastapi[standard]" python-dotenv pyjwt pyserial

fastapi dev main.py

## GET Endpoints

### 1. Retrieve Dashboard Progress

```javascript
GET /dashboard
```
* get user progress for all 3 levels

### 2. Retrieve Level Progress

```javascript
GET /levels/:level
```
* #### **Parameters**:
    * `:level`
    * **number**: specify the level to retrieve data for (e.g. 1,2,or 3)
* Retrieve level progress for specified route


### 3. Generate New Content

```javascript
GET /generateContent/:level
```
* #### **Parameters**:
    * `:level`
    * **number**: specify the level to generate content for
    * **2** will generate 10 words, **3** will generate 3 sentences
* Generate new content based on the provided level

## POST Endpoints

### 1. Register a New User

```javascript
POST /register
```
* ### **Body**:
```javascript
{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}
```
* Registers a new user
* **Returns an HttpOnly Cookie with JWT token**

### 2. User Login

```javascript
POST /login
```
* ### **Body**:
```javascript
{
    email: string,
    password: string
}
```
* Logs in user with credentials
* **Returns an HttpOnly Cookie with JWT token**

### 3. Update User Langauge Preference
#### Protected Route (Authentication Required)

```javascript
POST /language
```
* ### **Body**:
```javascript
{
    language: string
}
```
* Updates user language preference settings

### 4. Submit Test
#### Protected Route (Authentication Required)

```javascript
POST /submitTest
```
* ### **Body**:
```javascript
{
    level: number,
    isReading: boolean,
    score: number,
    difficulty: string
}
```
* Submits test results
* `score` is a percentage

### 4. Update Learning Score
#### Protected Route (Authentication Required)

```javascript
POST /updateScore/
```
* ### **Body**:
```javascript
{
    level: number,
    score: number,
    lastCompleted: number
}
```
* Updates learning score & progress
* `score` is a percentage (e.g. 0.8)
* `lastCompleted` is an index (use this index to retrieve the relevant word/sentence from the list)

## User Object Schema

### Notes
* `score` is a percentage (e.g. 0.8)
* `score` will be set to **-1** if it hasn't been submitted — this means the test wasn't completed
* `lastCompleted` is an index (use this index to retrieve the relevant word/sentence from the list)
```javascript
{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    progress: {
        level1: {
            learning: {
                lastCompleted: number,
                score: number
            },
            test: {
                score: number
            }
        },
        level2: {
            learning: {
                questions: []string,
                lastCompleted: number,
                score: number,
                difficulty: string
            },
            test: {
                score: number,
                difficulty: string
            }
        },
        level3: {
            reading: {
                score: number,
                difficulty: string
            },
            writing: {
                score: number,
                difficulty: string
            }
        },

    }
}
```
