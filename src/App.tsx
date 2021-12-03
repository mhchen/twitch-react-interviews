import React from 'react';
import logo from './logo.svg';
import './App.css';

/*
  <main class="main">
    <div>
      <button class="button" data-opener="offer">
        Show offer
      </button>
    </div>
    <div>
      <button class="button" data-opener="instructions">
        Show instructions
      </button>
    </div>
  </main>

  <div class="modal-overlay" data-overlay="offer" hidden>
    <div class="modal" role="alert" aria-role="alert">
      <div class="modal__header">
        <button class="button--icon" data-close="offer">
          X
        </button>
      </div>
      <div class="modal__body">
        Click the button below to accept amazing offer!
      </div>
      <div class="modal__footer">
        <button class="button" data-confirm="offer">
          Accept offer
        </button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" data-overlay="instructions" hidden>
    <div class="modal" role="alert" aria-role="alert">
      <div class="modal__header">
        <div class="button--icon" data-close="instructions">
          X
        </div>
      </div>
      <div class="modal__body">
        These are the instructions
      </div>
    </div>
  </div>
*/

export default function App() {
  return (
  <main className="main" id="asdflkasjfdlkajsfdlkj" onClick={() => { console.log('hello') }} style={{ display: 'none' }} />
  );
}
