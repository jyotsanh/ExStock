# Use Python 3.11 slim image as base
FROM python:3.12

# Set working directory
WORKDIR /app

# Install just the essential system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright with minimal dependencies
RUN pip install playwright && \
    playwright install chromium --with-deps

# Copy application code
COPY . .

# Expose the port
EXPOSE 8015

# Run the application
CMD ["uvicorn", "scrapper:app", "--host", "0.0.0.0", "--port", "8015"]