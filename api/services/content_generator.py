from utils.gemini_client import model
import json

def generate_words(n: int = 10, difficulty: str = "easy", language: str = "English") -> list[str]:
    prompt = f"""
Generate a list of {n} unique words in **{language}** that are **{difficulty}** level (e.g., 'hard' should return more complex vocabulary than 'medium' or 'easy').
- **Easy words should be 2-3 letters long**
- **Medium words should be 3-5 letters long**
- **Hard words should be 5-6 letters long**
- Do **not** include markdown, code fences, or explanation
- Use **common words** that are easy to read and understand
- Just return a **valid raw JSON array** of strings
Example:
["consequence", "environment", "translate", "priority", "emphasis"]
"""

    response = model.generate_content(prompt)
    print("Gemini raw response:", repr(response.text)) 
    print(prompt)
    print(difficulty)

    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        stripped = response.text.strip()
        if "[" in stripped and "]" in stripped:
            try:
                return json.loads(stripped[stripped.index("["):stripped.rindex("]")+1])
            except:
                pass
        return [f"Error parsing response: {stripped}"]
    
def generate_sentences(n: int = 3, difficulty: str = "easy", language: str = "English") -> list[str]:
    prompt = f"""
    Generate a list of {n} unique sentences in **{language}** that are **{difficulty}** level (e.g., 'hard' should return more complex vocabulary than 'medium' or 'easy').
    - **Easy sentences should be 2-3 words long**
    - **Medium sentences should be 3-4 words long**
    - **Hard sentences should be 4-5 words long**
    - Do **not** include markdown, code fences, puncuation, or explanation
    - Use **common words** that are easy to read and understand
    - Just return a **valid raw JSON array** of strings
    Example:
    ["consequence", "environment", "translate", "priority", "emphasis"]
    """

    response = model.generate_content(prompt)
    print("Gemini raw response:", repr(response.text))  
    print(prompt)
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        stripped = response.text.strip()
        if "[" in stripped and "]" in stripped:
            try:
                return json.loads(stripped[stripped.index("["):stripped.rindex("]")+1])
            except:
                pass
        return [f"Error parsing response: {stripped}"]
    
    
    

def generate_question_from_sentence(sentence: str) -> str:
    prompt = f"""
    Take the following sentence and generate a very simple reading comprehension question suitable for an early braille learner.

    Sentence: "{sentence}"

    - The question should focus on a basic fact from the sentence.
    - Return only the question as a plain string. No quotes, no formatting.

    Example:
    Sentence: "The dog is red"
    Return: What color is the dog?
    """

    response = model.generate_content(prompt)
    print("Gemini raw question response:", repr(response.text))

    # Cleanup if necessary
    return response.text.strip().strip('"').strip()


def check_answer(sentence: str, question: str, answer: str) -> str:
    prompt = f"""
    You are a tutor checking a student's answer.

    Given the sentence: "{sentence}"
    And the question: "{question}"
    Evaluate the answer: "{answer}"

    - Respond with "Correct" if the answer is correct.
    - Respond with "Incorrect" if the answer is not correct.
    - Do not explain. Just say "Correct" or "Incorrect".
    """

    response = model.generate_content(prompt)
    print("Gemini answer check response:", repr(response.text))

    verdict = response.text.strip().lower()
    if "correct" in verdict and "incorrect" not in verdict:
        return "Correct"
    else:
        return "Incorrect"