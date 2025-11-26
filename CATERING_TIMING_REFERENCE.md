# Catering Flow Animation Timing Reference

## Typing Animation Formula

All assistant messages with `isTyping: true` follow this animation sequence:

```
Total Animation Time = Bouncing Dots + Typewriter Effect + Cleanup
                     = 2000ms + (characters × 20ms) + 100ms
```

### Animation Phases:
1. **Bouncing Dots**: 2000ms (3 dots animation before text appears)
2. **Typewriter Effect**: 20ms per character (one character revealed at a time)
3. **Cleanup**: 100ms (final state transition after typing completes)

## Buffer Time Between Steps

**Always add a 500ms buffer** between when one animation completes and the next element appears. This ensures:
- Animations fully complete before next step
- Smooth transitions between steps
- No overlapping animations
- Consistent user experience

## Catering Flow Timing Calculations

### 1. Initial Catering Request ("add catering to a meeting")

#### ezCater Message:
```typescript
Content: "Ok, I can help with that! First I need a little more information:
* What is the address for the meeting?
* What time will the meeting be?
* How many people do you need to feed?
* Do you have any dietary restrictions?
* Do you have a specific cuisine in mind?"

Characters: ~262
Animation: 2000 + (262 × 20) + 100 = 7340ms
Starts: 1000ms after user message
Completes: 8340ms
```

#### Robin Message (appears after ezCater):
```typescript
Content: "If you click a meeting in the grid to the left I'll add some of this info for you. Or pick from the list below:"

Characters: ~120
Animation: 2000 + (120 × 20) + 100 = 4500ms
Delay from ezCater start: 7340 + 500 = 7840ms
Starts: 8840ms
Completes: 13340ms
```

#### Meeting List Widget (appears after Robin):
```typescript
Delay from Robin start: 4500 + 500 = 5000ms
Appears: 13840ms
```

### 2. Catering Items Request ("I need coffee and pastries")

#### ezCater Message:
```typescript
Content: "Great! I've found some nearby restaurants that can deliver coffee and pastries for your meeting."

Characters: ~97
Animation: 2000 + (97 × 20) + 100 = 4040ms
Starts: 1000ms after user message
Completes: 5040ms
```

#### Restaurant Options Card (appears after ezCater):
```typescript
Delay from ezCater start: 4040 + 500 = 4540ms
Appears: 5540ms
```

### 3. Restaurant Selection ("I'd like to order from [Restaurant]")

#### ezCater Menu Message:
```typescript
Content: "Perfect! Here's the menu from [Restaurant]. I've pre-filled quantities based on your [X] attendees."

Characters: ~110 (varies with restaurant name and attendee count)
Animation: 2000 + (110 × 20) + 100 = 4300ms
Starts: 800ms after user message
Completes: 5100ms
```

#### Menu Card (appears after message):
```typescript
Delay from message start: 4300 + 500 = 4800ms
Appears: 5600ms
```

### 4. Meeting Selection for Catering (clicking meeting in grid)

#### ezCater Cuisine Message:
```typescript
Content: "Perfect! I've noted that you want catering for \"[Title]\" at [Time] in [Room] for [X] attendees. What would you like to order? I can help you browse menus from local restaurants and caterers."

Characters: ~220 (varies with meeting details)
Animation: 2000 + (220 × 20) + 100 = 6500ms
Starts: 1000ms after meeting selection
Completes: 7500ms
```

#### Cuisine Options Card (appears after message):
```typescript
Delay from message start: 6500 + 500 = 7000ms
Appears: 8000ms
```

## Implementation Pattern

When adding typing animations with follow-up elements:

```typescript
// Step 1: Add typing message
setTimeout(() => {
  const message: Message = {
    id: uniqueId,
    content: "Your message here",
    sender: "assistant",
    isTyping: true,
    agentType: "ezcater",
    showFollowUpElement: false, // Don't show yet
  };
  setMessages([...messages, message]);
  
  // Step 2: Show follow-up element AFTER animation completes
  // Calculate: chars × 20ms + 2000ms + 100ms + 500ms buffer
  const animationTime = 2000 + (messageChars * 20) + 100;
  const delay = animationTime + 500; // Add 500ms buffer
  
  setTimeout(() => {
    setMessages(prev => prev.map(m => 
      m.id === uniqueId 
        ? { ...m, showFollowUpElement: true }
        : m
    ));
  }, delay);
}, initialDelay);
```

## Character Count Estimation

When calculating delays, use these guidelines for character counting:

1. **Static text**: Count exact characters in the template string
2. **Dynamic content**: Estimate maximum expected length
   - Restaurant names: ~20 chars
   - Meeting titles: ~30 chars
   - Times: ~10 chars
   - Room names: ~15 chars
3. **Newlines**: Count as 1 character each
4. **Template literals**: Replace variables with estimated lengths

Example:
```typescript
`Perfect! Here's the menu from ${restaurant.name}.`
// "Perfect! Here's the menu from " = 32 chars
// restaurant.name estimate = 20 chars
// "." = 1 char
// Total: ~53 chars
```

## Debugging Animation Timing

If animations feel off:

1. **Check character count**: Manually count or use `content.length`
2. **Verify buffer time**: Ensure 500ms buffer exists
3. **Test with different content lengths**: Dynamic content may vary
4. **Check cleanup timing**: 100ms cleanup happens after typing
5. **Look for setTimeout nesting**: Delays are cumulative from when setTimeout is called

## Common Mistakes

❌ **Wrong**: Using fixed delays without calculating animation time
```typescript
setTimeout(() => showCard(), 4000); // Might be too short or too long!
```

✅ **Correct**: Calculate based on message length
```typescript
const animationTime = 2000 + (chars * 20) + 100;
setTimeout(() => showCard(), animationTime + 500);
```

❌ **Wrong**: No buffer between steps
```typescript
setTimeout(() => showCard(), 4040); // Exact animation time, no buffer
```

✅ **Correct**: Add 500ms buffer
```typescript
setTimeout(() => showCard(), 4540); // Animation time + buffer
```

❌ **Wrong**: Incorrect setTimeout nesting math
```typescript
// If parent setTimeout is at 1000ms and child is at 7000ms,
// child executes at 8000ms, not 7000ms!
```

✅ **Correct**: Calculate cumulative delays
```typescript
// Child delay should be: parent_animation_time + buffer
// Not the absolute time you want it to appear
```

---

**Last Updated**: January 2025  
**Related Files**: 
- `/components/AiAssistantSidebar.tsx` (catering flow implementation)
- `/App.tsx` (meeting selection catering flow)
