"""Set up some constants for the project."""
from typing import List

from pydantic import SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings for the demo app.

    Reads from environment variables.
    You can create the .env file from the .env_example file.

    !!! SecretStr is a pydantic type that hides the value in logs.
    If you want to use the real value, you should do:
    SETTINGS.<variable>.get_secret_value()
    """

    class Config:
        env_file = ".env"


    openai_api_key: SecretStr
    anthropic_api_key: SecretStr
    
    supabase_url: str
    supabase_service_key: SecretStr

    whats_new_rss_feed: str = 'https://aws.amazon.com/about-aws/whats-new/recent/feed/'

    rtf_dir: str = 'data/prompt/rtf'
    txt_dir: str = 'data/prompt/txt'
    whats_new_output: str = 'data/context/whats_new.json'



SETTINGS = Settings()  # type: ignore
