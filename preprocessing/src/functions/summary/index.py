

from constants import SETTINGS
from functions.summary.llm import LLM


def generate_summary(content):
  llm = LLM()
    
  return llm.parse_text(content)

