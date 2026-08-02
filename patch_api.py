import os

path = r'e:\AI_Projects\zunicorn-agent\src\unicorn_agent\api.py'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix agent.harness -> agent._harness
old = 'self.agent.harness'
new = 'self.agent._harness'
count = content.count(old)
content = content.replace(old, new)

# Fix: add agent.start() before chat
old_chat = 'response = await self.agent.chat(message)'
new_chat = '''if not self.agent._started:
                await self.agent.start()
            response = await self.agent.chat(message)'''
content = content.replace(old_chat, new_chat)

# Fix agent.config -> agent._config 
old_config = 'self.agent.config'
new_config = 'self.agent._config'
config_count = content.count(old_config)
content = content.replace(old_config, new_config)

# Fix agent.list_tasks -> agent._harness.list_tasks (if needed)
# Fix agent.create_task -> agent._harness.create_task (if needed)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Fixed {count} harness references and {config_count} config references')
print('Patched API server successfully')