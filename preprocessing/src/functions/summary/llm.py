import json
from langchain_anthropic import ChatAnthropic

from langchain_core.messages import HumanMessage, SystemMessage


from constants import SETTINGS
from functions.summary.system import system_message


class LLM():
  ''' Class to prune HTML files using OpenAI's language model
  
  '''
  def __init__(self):
    self.model = self.start_model()


  def start_model(self):
    ''' Function to start the language model
  
    Returns:
      openai: The language model
    '''
    model = ChatAnthropic(
      anthropic_api_key=SETTINGS.anthropic_api_key.get_secret_value(),
      model="claude-3-haiku-20240307",
      temperature=0.2,
      max_tokens=1000,
    )

    return model
  

  def parse_text(self, text: str, max_attempts=3):
    ''' Function to parse the text using the language model and the system message to format the prompt

    Args:
      text: The text to parse

    Returns:
      parsed_text: The parsed text
    '''
    messages = [
      SystemMessage(
        content=system_message
      ),
      HumanMessage(
        content=text
      )
    ]

    response = self.model.invoke(messages).content

    
    try:
      summary = json.loads(response)['summary']
    except:
      print('Invalid response from model, trying again')
      if max_attempts > 0:
        return self.parse_text(text, max_attempts - 1)
      else:
        print('Max attempts reached, returning None')
        return None

    return summary
   
