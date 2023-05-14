import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styles from './App.module.scss';

const baseUrl = 'http://localhost:4000';

export default function App() {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  //useEffect(() => console.log('debug ' + isLoading), [isLoading]);

  useEffect(() => {
    setIsLoading(false);
  }, [guests]);

  // trigger an action on first render
  // get data
  useEffect(() => {
    async function fetchQuests() {
      setIsLoading(true);

      const response = await fetch(`${baseUrl}/guests/`);
      const guest = await response.json();
      //await new Promise((resolve) => setTimeout(resolve, 1000));

      setGuests([...guest]);
      //setIsLoading(false);
    }
    fetchQuests().catch((error) => console.log(error));
  }, []);

  // add guest
  const addGuest = async () => {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    const newGuestList = [...guests, createdGuest];
    setGuests(newGuestList);
    setFirstName('');
    setLastName('');
  };

  // delete guest
  const deleteGuest = async (para) => {
    const response = await fetch(`${baseUrl}/guests/${para}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = guests.filter((guest) => guest.id !== deletedGuest.id);
    setGuests(newGuestList);
  };

  // update attending
  const toggleAttending = async (para) => {
    const index = guests.findIndex((guest) => guest.id === para);
    const response = await fetch(`${baseUrl}/guests/${para}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !guests[index].attending }),
    });
    const updatedGuest = await response.json();
    const newUpdatedGuest = [...guests];
    newUpdatedGuest[index].attending = updatedGuest.attending;
    setGuests(newUpdatedGuest);
  };

  const renderList = () => {
    return guests.map((guest) => (
      <div key={`user-${guest.id}`} data-test-id="guest">
        <FontAwesomeIcon
          className={styles.icon}
          icon={faLeaf}
          style={{ color: '#ffffff' }}
        />
        <label htmlFor={`attending-${guest.id}`}>Attending:</label>
        <input
          type="checkbox"
          id={`attending-${guest.id}`}
          aria-label={`${guest.firstName} ${guest.lastName} attending status`}
          checked={guest.attending}
          onChange={() => toggleAttending(guest.id)}
        />
        <span>{`${guest.firstName} ${guest.lastName}`}</span>
        <button
          className={styles.buttonRemove}
          aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
          onClick={() => deleteGuest(guest.id)}
        >
          Remove
        </button>
      </div>
    ));
  };

  return (
    <>
      {/* <img className={styles.img} src={image} alt="img" /> */}
      <div className={styles.container}>
        <h1>Guest List</h1>
        {JSON.stringify(toggleAttending)}
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            disabled={isLoading}
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          />
          <br />
          <label htmlFor="lastName">Last name</label>
          <input
            disabled={isLoading}
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
          />
          <br />
          <button onClick={() => addGuest()} disabled={isLoading}>
            Add guest
          </button>
        </form>
        {isLoading ? <div>Loading...</div> : renderList()}
      </div>
    </>
  );
}
