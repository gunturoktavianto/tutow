# AI Tutor Setup Guide

## Overview

The AI Tutor feature uses OpenAI's Realtime API to provide voice-based tutoring for students learning mathematics. The AI can explain materials, help with problems, and provide interactive guidance.

## Setup Requirements

### 1. OpenAI API Key

You need an OpenAI API key with access to the Realtime API:

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Browser Permissions

The AI Tutor requires microphone access to work properly. Make sure your browser allows microphone access for the application.

## Features

### Voice Interaction

- **Start Session**: Click the AI Tutor button to begin a voice session
- **Voice Recognition**: Speak naturally and the AI will transcribe your speech
- **AI Response**: The AI responds with voice and text explanations

### Material Explanation

- **Explain Material**: AI can explain the current course material
- **Problem Help**: AI provides step-by-step guidance for specific problems
- **Interactive Chat**: Text-based interaction is also available

### UI Components

- **Floating Button**: Always accessible AI Tutor button in the bottom-right
- **Expandable Chat**: Full conversation interface when expanded
- **Volume Indicator**: Visual feedback for AI voice output
- **Status Display**: Shows connection status and current activity

## Usage in Courses

### For Course Developers

To integrate AI explanations in your course components:

```tsx
interface CourseProps {
  courseId: string;
  courseData?: any;
  onExplainMaterial?: (material: string) => void;
  onExplainProblem?: (problem: string) => void;
}

export function YourCourse({ onExplainProblem }: CourseProps) {
  const handleAskHelp = () => {
    if (onExplainProblem) {
      onExplainProblem("Explain how to solve this specific problem...");
    }
  };

  return (
    <div>
      {/* Your course content */}
      <Button onClick={handleAskHelp}>
        <Bot className="w-4 h-4 mr-2" />
        Minta Bantuan AI
      </Button>
    </div>
  );
}
```

### For Students

1. Navigate to any course page
2. Click the floating AI Tutor button
3. Grant microphone permissions when prompted
4. Click "Mulai Sesi" to start the AI session
5. Use voice or text to interact with the AI
6. Click "Jelaskan Materi" for material explanations
7. Use "Minta Bantuan AI" buttons in exercises for specific help

## Technical Implementation

### WebRTC Integration

- Uses OpenAI's Realtime API with WebRTC for low-latency voice interaction
- Handles audio streaming, transcription, and TTS responses
- Manages connection state and error handling

### Components

- `useOpenAIRealtime`: Hook for managing WebRTC connection and conversation
- `AITutor`: Main UI component with voice controls and chat interface
- Course integration via props for contextual explanations

### API Routes

- `/api/openai/session`: Creates ephemeral tokens for OpenAI Realtime API
- Handles authentication and session management

## Troubleshooting

### Common Issues

1. **Microphone not working**: Check browser permissions
2. **Connection failed**: Verify OPENAI_API_KEY is set correctly
3. **No voice output**: Check browser audio settings and volume
4. **Session timeout**: Refresh page and start a new session

### Error Messages

- "OPENAI_API_KEY is not set": Add the API key to environment variables
- "Failed to create session": Check API key validity and account credits
- "Microphone access denied": Grant microphone permissions in browser

## Development Notes

### Voice Configuration

The AI is configured with:

- Model: `gpt-4o-mini-realtime-preview-2024-12-17`
- Voice: `alloy` (can be customized)
- Language: Indonesian (Bahasa Indonesia)
- Instructions: Child-friendly math tutoring approach

### Customization

You can customize the AI's behavior by modifying the instructions in `/api/openai/session/route.ts`:

```typescript
instructions: "Kamu adalah AI tutor untuk aplikasi Tutow...";
```

The AI is specifically trained to:

- Use child-friendly Indonesian language
- Provide step-by-step explanations
- Encourage interactive learning
- Give hints rather than direct answers
