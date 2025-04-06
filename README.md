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
            test: {
                score: number,
                difficulty: string
            }
        },

    }
}
```
