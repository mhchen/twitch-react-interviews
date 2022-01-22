/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import './App.css';

type Character = {
  character: string;
} & (
  | {
      incorrect: true;
    }
  | {
      inProgress: true;
    }
  | {
      yellow: true;
    }
  | {
      green: true;
    }
);

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
      guess[i] = {
        character,
        yellow: true,
      };
    } else {
      guess[i] = {
        character,
        incorrect: true,
      };
    }
  });
  return guess;
}

function convertCurrentInputToGuess(input: string): Guess {
  return input.split('').map((character) => ({
    character,
    inProgress: true,
  }));
}

type GuessComponentProps = {
  guess?: Guess;
};

const LETTERS_PER_WORD = 5;

function GuessComponent({ guess }: GuessComponentProps) {
  return (
    <div className="guess">
      {[...Array(LETTERS_PER_WORD).keys()].map((i) => {
        const character = guess?.[i];

        let characterClass = '';
        if (character) {
          if ('green' in character) {
            characterClass = 'tile--green';
          } else if ('yellow' in character) {
            characterClass = 'tile--yellow';
          } else if ('inProgress' in character) {
            characterClass = 'tile--in-progress tile--bounce';
          } else {
            characterClass = 'tile--incorrect';
          }
        }
        return (
          <div className={`tile ${characterClass}`}>{character?.character}</div>
        );
      })}
    </div>
  );
}

const TOTAL_GUESSES = 6;

export default function App() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
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

  const checkInput = async () => {
    if (currentGuess.length !== 5) {
      return;
    }

    const isValid = (await fetch(
      'https://api.frontendeval.com/fake/word/valid',
      {
        method: 'POST',
        body: JSON.stringify({ word: currentGuess }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json())) as boolean;

    if (!isValid) {
      return;
    }

    const guess = convertInputToGuess(currentGuess, todaysWord!);

    if (guess.every((character) => 'green' in character)) {
      setHasWon(true);
    }

    const newGuesses = [...guesses, guess];

    if (guesses.length === TOTAL_GUESSES) {
      setHasLost(true);
    }

    setGuesses(newGuesses);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (e.metaKey || e.ctrlKey || hasWon || hasLost) {
        return;
      }

      if (!/^[A-Z]$/.test(key) && e.key !== 'Backspace' && e.key !== 'Enter') {
        return;
      }

      if (e.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
      } else if (e.key === 'Enter') {
        void checkInput();
        setCurrentGuess('');
      } else if (currentGuess.length <= 5) {
        setCurrentGuess(currentGuess + key);
      }
    };
    document.body.addEventListener('keydown', listener);

    return () => {
      document.body.removeEventListener('keydown', listener);
    };
  }, [currentGuess, hasWon, hasLost]);

  if (!todaysWord) {
    return null;
  }

  return (
    <main>
      {hasWon && <div>You win!</div>}
      {hasLost && <div>{todaysWord}</div>}
      {[...Array(TOTAL_GUESSES).keys()].map((i) => {
        const guess =
          i === guesses.length
            ? convertCurrentInputToGuess(currentGuess)
            : guesses[i];
        return <GuessComponent key={i} guess={guess} />;
      })}
    </main>
  );
}
