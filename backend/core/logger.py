"""
Logging configuration for the application
"""
import logging
import sys


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        # Console handler
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    
    return logger


def log_api_request(method: str, path: str, status_code: int, duration: float):
    """Log API request"""
    logger = get_logger("api")
    logger.info(f"{method} {path} - {status_code} ({duration:.3f}s)")


def log_error_with_context(error: Exception, context: dict):
    """Log error with context"""
    logger = get_logger("error")
    logger.error(f"Error: {error}, Context: {context}", exc_info=True)
