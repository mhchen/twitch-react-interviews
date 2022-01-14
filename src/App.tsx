/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './App.css';

interface Character {
  character: string;
  yellow: boolean;
  green: boolean;
}

type Guess = Character[];

function convertInputToGuess(input: string, todaysWord: string): Guess {
  const todaysWordHash: Record<string, number> = {};

  for (const character of todaysWord.split('')) {
    todaysWordHash[character] = todaysWordHash[character] || 0;
    todaysWordHash[character]++;
  }

  const inputArray = input.toUpperCase().split('');

  const guess: Guess = [];

  inputArray.forEach((character, i) => {
    const green = character === todaysWord[i];

    if (green) {
      todaysWordHash[i]--;
      guess[i] = {
        character,
        green,
        yellow: false,
      };
    }
  });

  inputArray.forEach((character, i) => {
    if (guess[i]) {
      return false;
    }

    const yellow = Boolean(todaysWordHash[character]);

    if (yellow) {
      todaysWordHash[character]--;
    }

    guess[i] = {
      character,
      green: false,
      yellow,
    };
    console.log(guess, guess[i]);
  });

  console.log(guess);
  return guess;
}

type GuessComponentProps = {
  guess: Guess;
};

function GuessComponent({ guess }: GuessComponentProps) {
  return (
    <div className="guess">
      {guess.map((character) => (
        <div
          className={`tile ${character.green ? 'tile--green' : ''} ${
            character.yellow ? 'tile--yellow' : ''
          }`}
        >
          {character.character}
        </div>
      ))}
    </div>
  );
}

const TOTAL_GUESSES = 6;

export default function App() {
  const [previousGuesses, setPreviousGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState('');
  const [todaysWord, setTodaysWord] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  useEffect(() => {
    void fetch('https://api.frontendeval.com/fake/word')
      .then((res) => res.text())
      .then((word) => {
        setTodaysWord(word.toUpperCase());
      });
  }, []);

  const checkInput = async (e: FormEvent) => {
    e.preventDefault();

    if (input.length !== 5) {
      return;
    }

    const isValid = await fetch(
      'https://api.frontendeval.com/fake/word/valid',
      {
        method: 'POST',
        body: JSON.stringify({ word: input }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json());

    if (!isValid) {
      return;
    }

    const guess = convertInputToGuess(input, todaysWord!);

    if (guess.every((character) => character.green)) {
      setHasWon(true);
    }

    const guesses = [...previousGuesses, guess];

    if (guesses.length === TOTAL_GUESSES) {
      setHasLost(true);
    }

    setPreviousGuesses(guesses);
  };

  if (!todaysWord) {
    return null;
  }

  return (
    <main>
      {hasWon && <div>You win!</div>}
      {hasLost && <div>{todaysWord}</div>}
      {!hasWon && !hasLost && (
        <>
          You have {TOTAL_GUESSES - previousGuesses.length} guesses remaining.
          <form onSubmit={checkInput}>
            <div className="input-container">
              <input
                type="text"
                value={input}
                maxLength={5}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
              />
              <button type="submit">Submit</button>
            </div>
          </form>
        </>
      )}
      {previousGuesses.map((guess, i) => (
        <GuessComponent key={i} guess={guess} />
      ))}
    </main>
  );
}
