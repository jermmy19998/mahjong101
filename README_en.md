# Xuzhou Mahjong Quiz

This is a web application designed to help Mahjong enthusiasts practice their tile-matching skills, specifically focusing on identifying winning tiles in numerical sequences (夹张).

## Overview

![Xuzhou Mahjong Quiz Overview](./overview.png)

This project is a web-based Mahjong tile-matching practice tool with the following key features.

### Core Features
- Randomly generates valid Mahjong hands
- Intelligently determines possible winning tiles
- Provides multiple options for users to choose from
- Gives instant feedback on the answer

### Technical Architecture
- Frontend: Pure HTML + CSS + JavaScript
- No backend server required
- No database required
- No external dependencies

### Main Modules
1. Hand Generation Module
   - Randomly generates 13 tiles for a hand
   - Ensures the hand allows for a valid win
   - Controls the number of wind tiles for a balanced hand

2. Winning Tile Determination Module
   - Supports identifying sequences (顺子) and triplets (刻子) for numerical tiles
   - Supports identifying pairs (对子)
   - Ignores the influence of wind tiles and Laizi (赖子)

3. Option Generation Module
   - Generates 5 options, including the correct answer
   - Options include wind tiles, Laizi, and other potential numerical sequences
   - Randomly shuffles the options

4. User Interface Module
   - Responsive design
   - Animation effects
   - Instant feedback

### Project Goals
- Help Mahjong enthusiasts improve their winning tile identification skills
- Provide a simple and easy-to-use practice tool
- Support practice with various tile patterns
- Provide a good user experience

## Features

- 🎮 Interactive practice interface
- 🎯 Focuses on identifying winning tiles in numerical sequences (夹张)
- 🎨 Beautiful Mahjong tile display
- 🎯 Instant feedback on answers
- 🎉 Animation effects for correct answers

## How to Use

1. Open the `mj_xuzhou.html` file.
2. The system will randomly generate a hand and display possible winning tile options.
3. Select the tile you believe is the correct winning tile from the 5 options.
4. The system will immediately show if your choice is correct.
5. Click the "Next Question" button to continue practicing.

## Technical Implementation

- Implemented using pure HTML, CSS, and JavaScript
- No external dependencies required
- Responsive design, supporting various screen sizes
- Uses CSS animations for smooth visual effects

## Tile Types Explained

- Supports Man (万), Suo (条), and Tong (筒) numerical tiles
- Supports East, South, West, and North wind tiles
- Supports Laizi (赖子) tile
- Winning tile practice primarily focuses on numerical sequences (e.g., 3 Man and 5 Man winning on 4 Man)

## Project Structure

```
mahjong101/
├── mj_xuzhou.html    # Main page
├── mj_xuzhou.js      # Game logic
└── pics/            # Mahjong tile image resources
```

## Development Notes

### Core Functionality

1. Hand Generation
   - Randomly generates 13 tiles for a hand
   - Ensures the hand allows for a valid win
   - Controls the number of wind tiles for a balanced hand

2. Option Generation
   - Generates 5 options, including the correct answer
   - Options include wind tiles, Laizi, and other potential numerical sequences
   - Randomly shuffles the options

3. Winning Tile Judgment
   - Supports identifying sequences and triplets for numerical tiles
   - Supports identifying pairs
   - Ignores the influence of wind tiles and Laizi

### Interface Design

- Uses a modern UI design
- Responsive layout for different devices
- Elegant animation effects
- Clear visual feedback

## Future Plans

- [ ] Add practice for more tile patterns
- [ ] Increase difficulty levels
- [ ] Add a scoring system
- [ ] Support more Mahjong rules
- [ ] Add sound effect support


## License

MIT License 