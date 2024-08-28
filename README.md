## Overview
The Prompter application is a simple web-based interface that allows users to send prompts to OpenAI's GPT model and display the responses. Users can customize parameters such as the model type, temperature, and maximum tokens for fine-tuning the prompt and response behavior. The application supports a chat-like interface, displaying conversation history with the AI.

## Features
- **System and User Prompts**: Input fields to specify the system and user prompts.
- **Response Display**: Dynamic display of responses from the model.
- **Customizable Parameters**: Options to set API key, model, temperature, maximum tokens, top-p, frequency penalty, and presence penalty.
- **History Management**: Ability to clear the conversation history.
- **Collapsible Responses**: Toggle collapse/expand for individual responses in the chat history.

## Getting Started

### Prerequisites
- A modern web browser (Google Chrome, Mozilla Firefox, etc.).
- An OpenAI API key with appropriate permissions.

### Usage
To use the application, open the `index.html` file in your web browser. 

### HTML Structure
- **Container Layout**: Divided into two main sections - `left` for prompt input and response display, and `right` for adjustable parameters.
- **Text Areas**: 
  - System Prompt
  - User Prompt
- **Buttons**:
  - Send Prompt
  - Clear History
- **Response Section**: Area where the AI-generated responses are displayed.

### JavaScript Functionality
The JavaScript code provides interactivity through the following main functions:
1. `sendToGPT()`: Sends the user-inputted prompt to OpenAI's API and updates the response element with the model's reply.
2. `updateResponseElement()`: Updates the response area with the latest conversation history.
3. `toggleContent(buttonElement)`: Toggles the visibility of individual responses.
4. `clearHistory()`: Clears the chat history and updates the UI.
5. `escapeHtml(unsafe)`: Escapes potentially unsafe HTML characters in the bot response.

#### Detailed Function Documentation

**sendToGPT()** 
- Collects values from user inputs for API key, model, and parameters.
- Constructs a request payload including the conversation history.
- Sends the request to OpenAI's API and handles the response.
- Updates the conversation history and response element.
- Handles and displays errors encountered during the API call.

**updateResponseElement()**
- Iterates through the conversation history and constructs HTML elements for each message.
- Renders each message with buttons for collapsing/expanding the content.

**toggleContent(buttonElement)**
- Toggles the display of the response content between collapsed and expanded states.

**clearHistory()**
- Resets the conversation history and clears the displayed responses.

**escapeHtml(unsafe)**
- Escapes special characters to prevent HTML injection, ensuring displayed content is safe.
