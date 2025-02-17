Producer Wordle
Producer Wordle is a web application that allows users to recreate drum patterns by drawing them on a piano roll interface. The goal is to match the correct drum pattern within a limited number of moves. The application provides tools for playback, editing, and checking the accuracy of the recreated drum pattern.

Features
Piano Roll Interface: Draw drum patterns on a piano roll.
Playback Controls: Play, pause, and adjust the tempo of the drum pattern.
Correct Mode: Listen to the correct drum pattern for reference.
Pen Mode: Add or remove notes using the pen tool.
Selection and Dragging: Select and move multiple notes.
Accuracy Check: Check the accuracy of the recreated drum pattern against the correct pattern.
Move Counter: Track the number of moves made to recreate the pattern.
Getting Started
Prerequisites
Node.js
npm (Node Package Manager)
Installation
Clone the repository:

Install the dependencies:

Running the Application
Start the development server:

Open your browser and navigate to http://localhost:3000 to view the application.

Building for Production
To create a production build, run:

Project Structure
public: Contains static assets such as audio samples and the HTML template.
src: Contains the source code for the application.
Components/: React components for the application.
Hooks/: Custom hooks used in the application.
Models/: Data models used in the application.
Providers/: Context providers for state management.
Services/: Utility functions and services.
CSS/: CSS files for styling the application.
README.md: This file.
Usage
Drawing Drum Patterns: Use the pen tool to draw drum patterns on the piano roll.
Playback: Use the playback controls to play and pause the drum pattern.
Correct Mode: Toggle between the correct drum pattern and your recreated pattern.
Check Accuracy: Click the "Check Accuracy" button to see how close your pattern is to the correct one.
Move Counter: Keep track of your moves to see if you can recreate the pattern within the allowed moves.
Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements
This project was bootstrapped with Create React App.
