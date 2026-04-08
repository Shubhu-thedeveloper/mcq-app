import asyncio
import random
from backend.database import question_collection

def generate_questions():
    questions = []
    # Mix of simple math questions for easy verification
    for i in range(1, 101):
        num1 = random.randint(1, 100)
        num2 = random.randint(1, 100)
        op = random.choice(['+', '-', '*'])
        
        if op == '+':
            ans = num1 + num2
        elif op == '-':
            ans = num1 - num2
        else:
            ans = num1 * num2
            
        options = [ans, ans + random.randint(1, 10), ans - random.randint(1, 10), ans * 2]
        random.shuffle(options)
        
        # Determine correct key based on options
        keys = ['A', 'B', 'C', 'D']
        opts_dict = []
        correct_key = 'A'
        for idx, val in enumerate(options):
            opts_dict.append({"key": keys[idx], "text": str(val)})
            if val == ans:
                correct_key = keys[idx]
                
        questions.append({
            "question_text": f"What is {num1} {op} {num2}?",
            "options": opts_dict,
            "correct_answer": correct_key
        })
    return questions

async def seed_db():
    count = await question_collection.count_documents({})
    if count == 0:
        print("Seeding database with 100 questions...")
        questions = generate_questions()
        await question_collection.insert_many(questions)
        print("Seeding complete.")
    else:
        print(f"Database already contains {count} questions.")

if __name__ == "__main__":
    asyncio.run(seed_db())
