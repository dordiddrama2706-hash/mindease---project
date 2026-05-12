
const responses: Record<string, string[]> = {
  greeting: [
    "Hello there. I'm Lumi, your personal wellness companion. How are you feeling today?",
    "Hi friend. Take a deep breath. I'm here to listen. What's on your mind?",
    "Greetings. I'm here to help you find some calm. Would you like to talk about your day?"
  ],
  anxious: [
    "I hear you. When things feel overwhelming, let's try a grounding exercise. Can you name 5 things you see around you?",
    "Anxiety can feel like a heavy cloud. Remember that you are the sky, and this cloud is just passing through. What triggered this feeling?",
    "Take a slow, deep breath. You are safe. Would you like to try a 4-7-8 breathing exercise with me?"
  ],
  sad: [
    "It's okay to feel sad. You don't have to be 'on' all the time. Tell me more about what's weighing on you.",
    "I'm here for you. Sending you a gentle, virtual hug. Is there something small you could do for yourself today, like drinking a warm tea?",
    "Crying is a release, not a weakness. I'm listening if you want to express what's in your heart."
  ],
  stressed: [
    "Stress can make the world feel very loud. Let's try to silence the noise for a moment. What's the one thing on your plate that feels most urgent?",
    "You're doing a lot. It's okay to step back and rest. Have you taken a break today?",
    "Let's focus on what you *can* control. Everything else can wait for a few minutes while we breathe."
  ],
  journal: [
    "Journaling is a beautiful way to clear the fog. Try starting with: 'Today, I am feeling...' or 'One thing I'm grateful for is...'",
    "If you're stuck, why not write about a place where you feel completely safe and calm?",
    "Your journal is your safe space. No judgment, just your honest thoughts flowing onto the page."
  ],
  happy: [
    "That's wonderful! I'm so happy to hear that. What specifically made the day feel brighter?",
    "Cherish this moment. Happiness is like sunshine—let it soak in. What are you most proud of today?",
    "I love hearing about your wins! Let's celebrate this positive energy together."
  ],
  default: [
    "Thank you for sharing that with me. Tell me more.",
    "I see. How does that make you feel in your body?",
    "I'm here to support you. What would be most helpful for you right now?",
    "Let's explore that thought a bit deeper. Why do you think that is?",
    "You're doing great just by being aware of your thoughts."
  ]
};

const keywords: Record<string, string> = {
  anxi: "anxious",
  panic: "anxious",
  overwhelm: "anxious",
  scared: "anxious",
  fear: "anxious",
  sad: "sad",
  depress: "sad",
  cry: "sad",
  blue: "sad",
  stress: "stressed",
  tired: "stressed",
  exhaust: "stressed",
  busy: "stressed",
  journal: "journal",
  write: "journal",
  reflect: "journal",
  happy: "happy",
  glad: "happy",
  good: "happy",
  great: "happy",
  hello: "greeting",
  hi: "greeting",
  lumi: "greeting"
};

export function getOfflineResponse(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  for (const [kw, category] of Object.entries(keywords)) {
    if (lowercaseInput.includes(kw)) {
      const categoryResponses = responses[category];
      return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
  }
  
  return responses.default[Math.floor(Math.random() * responses.default.length)];
}
