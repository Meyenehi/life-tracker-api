FROM node:12.9-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NAME Life Tracker

# Run app.py when the container launches
CMD ["npm", "run", "start:dev"]