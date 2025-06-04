from setuptools import setup, find_packages

setup(
    name="boram-safety",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.109.1",
        "uvicorn==0.27.0",
        "sqlalchemy==2.0.25",
        "python-dotenv==1.0.0",
        "pydantic==2.5.3",
        "pydantic[email]",
        "python-multipart==0.0.6",
        "pillow==10.2.0",
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "aiofiles==23.2.1"
    ],
    package_dir={"": "."}
) 