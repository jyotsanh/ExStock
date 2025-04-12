# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /chatAPI

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app code
COPY . .

# Expose port (adjust if needed)
EXPOSE 8020

# Run the app with Uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8020"]
