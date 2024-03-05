import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);

  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const [select, setSelect] = useState(false);

  const [formAddFriend, setFormAddFriend] = useState(false);

  function handleNewFriend() {
    setFormAddFriend(!formAddFriend);
  }

  const id = crypto.randomUUID();
  function handleForm(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    setFriends([...friends, newFriend]);

    setFormAddFriend(false);

    setImage("https://i.pravatar.cc/48");
    setName("");
  }

  function handleSelect(friend) {
    setSelect((select) => (select?.id === friend.id ? null : friend));
    setFormAddFriend(false);
  }

  function handlePayment(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        select?.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          handleSelect={handleSelect}
          select={select}
        />
        {formAddFriend && (
          <FormAddFriend
            name={name}
            setName={setName}
            image={image}
            setImage={setImage}
            handleForm={handleForm}
          />
        )}
        <Button onClick={handleNewFriend}>
          {formAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {select && (
        <FormSplitBill friend={select} handlePayment={handlePayment} />
      )}
    </div>
  );
}

function FriendsList({ friends, handleSelect, select }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelect={handleSelect}
          select={select}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelect, select }) {
  const isActive = friend.id === select?.id;

  return (
    <li className={isActive ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You only owe ${Math.abs(friend.balance)} to {friend.name}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} only owes you ${friend.balance}
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClick={() => handleSelect(friend)}>
        {!isActive ? "SELECT" : "CLOSE"}
      </Button>
    </li>
  );
}

function FormSplitBill({ friend, handlePayment }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [pay, setPay] = useState("You");

  function handlePay(e) {
    e.preventDefault();
    const value = pay === "You" ? bill - myExpense : -(bill - myExpense);
    handlePayment(value);
  }

  return (
    <form className="form-split-bill">
      <h2>Split Bill with {friend.name}.</h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🙍 Your Expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(() =>
            e.target.value > bill ? myExpense : e.target.value
          )
        }
      ></input>
      <label>🤵 {friend.name}'s Expense</label>
      <input type="text" value={bill ? bill - myExpense : ""} disabled></input>
      <label>🤔 Who's paying the bill</label>
      <select value={pay} onChange={(e) => setPay(e.target.value)}>
        <option value="You">You</option>
        <option value={friend.name}>{friend.name}</option>
      </select>
      <Button onClick={(e) => handlePay(e)}>Split Bill</Button>
    </form>
  );
}

function FormAddFriend({ name, setName, image, setImage, handleForm }) {
  return (
    <form className="form-add-friend" onSubmit={handleForm}>
      <label>👯 Add Friend</label>
      <input
        type="text"
        value={name}
        placeholder="Enter your friend name"
        onChange={(e) => {
          setName(e.target.value);
          console.log(name);
        }}
      ></input>
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        placeholder="Place the URL"
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button onClick={handleForm}>ADD</Button>
    </form>
  );
}

function Button(props) {
  return (
    <button onClick={props.onClick} className="button">
      {props.children}
    </button>
  );
}
