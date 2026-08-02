import sys
import os

sys.path.insert(0, r'e:\AI_Projects\zunicorn-agent\src')

import asyncio
import logging
import json
import argparse

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

from unicorn_agent import UnicornAgent, UnicornConfig
from unicorn_agent.config import ModelConfig
from unicorn_agent.api import UnicornAPIServer


async def main():
    parser = argparse.ArgumentParser(description="ZUnicorn Agent API Server")
    parser.add_argument("--api-key", default=os.environ.get("LLM_API_KEY", ""), help="API key")
    parser.add_argument("--provider", default=os.environ.get("LLM_PROVIDER", "ollama"), help="LLM provider")
    parser.add_argument("--model", default=os.environ.get("LLM_MODEL", "qwen2.5"), help="Model name")
    parser.add_argument("--base-url", default=os.environ.get("LLM_BASE_URL", ""), help="Custom base URL")
    parser.add_argument("--port", type=int, default=6274, help="Port to listen on")
    args = parser.parse_args()

    config = UnicornConfig(
        model=ModelConfig(
            provider=args.provider,
            model=args.model,
            api_key=args.api_key or None,
            base_url=args.base_url or None,
        )
    )

    agent = UnicornAgent(config)
    server = UnicornAPIServer(agent, port=args.port)
    
    logger.info(f"Starting ZUnicorn Agent API server on port {args.port}")
    logger.info(f"Provider: {args.provider}, Model: {args.model}")
    
    await server.start()


if __name__ == "__main__":
    asyncio.run(main())