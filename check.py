from chatbot import ask, append_interaction_to_chat_log

chat_log = None

question = 'Who played Forrest Gump in the movie?'
answer = ask(question, chat_log)
print(answer)