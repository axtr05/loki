from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
    
    async def chat(self, message: str, session_id: str = "default", conversation_history: list = None):
        """
        Chat with AI assistant
        Args:
            message: User's message
            session_id: Unique session identifier
            conversation_history: Previous messages for context
        Returns:
            AI response text
        """
        try:
            # Create system message for learning assistant
            system_message = """You are an intelligent learning assistant for a gamified learning platform. 
Your role is to:
- Explain complex concepts in simple, easy-to-understand terms
- Answer questions about study materials accurately
- Create engaging quizzes and flashcards on demand
- Generate helpful study tips and learning strategies
- Summarize content concisely
- Encourage and motivate learners
- Provide step-by-step explanations when needed

Be friendly, encouraging, and educational. Keep responses clear and concise."""

            # Initialize chat with session ID
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_message
            )
            
            # Use GPT-4o-mini as default model (cost-effective and fast)
            chat.with_model("openai", "gpt-4o-mini")
            
            # Create user message
            user_message = UserMessage(text=message)
            
            # Send message and get response
            response = await chat.send_message(user_message)
            
            return response
            
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            raise Exception(f"Failed to get AI response: {str(e)}")

# Singleton instance
ai_service = AIService()
