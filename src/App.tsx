import { ChangeEvent, useEffect, useState } from 'react';

const API_URL = 'https://api.frontendeval.com/fake/food';

type AutocompleteProps = {
  addItem: (item: string) => void;
};

const MINIMUM_SEARCH_LENGTH = 2;

function Autocomplete({ addItem }: AutocompleteProps) {
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [searchResults, setSearchResults] = useState<string[] | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAutocompleteValue(value);

    if (value.length < MINIMUM_SEARCH_LENGTH) {
      setSearchResults(null);
    }
  };

  useEffect(() => {
    const intervalId = setTimeout(() => {
      if (autocompleteValue.length < MINIMUM_SEARCH_LENGTH) {
        return;
      }

      void (async () => {
        const response = (await fetch(`${API_URL}/${autocompleteValue}`).then(
          (res) => res.json(),
        )) as string[];
        setSearchResults(response.length ? response : [autocompleteValue]);
      })();
    }, 200);

    return () => clearInterval(intervalId);
  }, [autocompleteValue]);

  const handleItemClick = (item: string) => {
    addItem(item);
    setSearchResults(null);
    setAutocompleteValue('');
  };

  return (
    <div className="autocomplete">
      <input
        type="search"
        value={autocompleteValue}
        onChange={handleChange}
        className="autocomplete__input"
      />
      {searchResults && (
        <ul className="autocomplete__results">
          {searchResults.map((item) => (
            <li className="autocomplete__results__item" key={item}>
              <button
                className="autocomplete__results__button"
                onClick={() => handleItemClick(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ShoppingListItem {
  id: number;
  name: string;
  checked: boolean;
}

type ShoppingListProps = {
  shoppingList: ShoppingListItem[];
  toggleItemCheck: (id: number) => void;
  deleteItem: (id: number) => void;
};

function ShoppingList({
  shoppingList,
  toggleItemCheck,
  deleteItem,
}: ShoppingListProps) {
  return (
    <ul className="shopping-list">
      {shoppingList.map(({ id, name, checked }) => (
        <li key={id} className="shopping-list__item" data-checked={checked}>
          <div>
            <button
              className="shopping-list__check"
              onClick={() => toggleItemCheck(id)}
            >
              ✓
            </button>
            {checked ? <del>{name}</del> : name}
          </div>
          <button onClick={() => deleteItem(id)}>✗</button>
        </li>
      ))}
    </ul>
  );
}

let nextItemId = 1;

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  const addItem = (itemName: string) => {
    if (shoppingList.some(({ name }) => name === itemName)) {
      return;
    }

    setShoppingList([
      ...shoppingList,
      {
        id: nextItemId++,
        name: itemName,
        checked: false,
      },
    ]);
  };

  const toggleItemCheck = (id: number) => {
    const index = shoppingList.findIndex((item) => item.id === id);
    const item = shoppingList[index];
    const newItem = {
      ...item,
      checked: !item.checked,
    };

    setShoppingList([
      ...shoppingList.slice(0, index),
      newItem,
      ...shoppingList.slice(index + 1),
    ]);
  };

  const deleteItem = (id: number) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id));
  };

  return (
    <main>
      <h1 className="title">My shopping list</h1>
      <Autocomplete addItem={addItem} />
      <ShoppingList
        shoppingList={shoppingList}
        toggleItemCheck={toggleItemCheck}
        deleteItem={deleteItem}
      />
    </main>
  );
}
