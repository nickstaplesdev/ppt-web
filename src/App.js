import React from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import './App.css';

const INITIAL_STATE = {
  text: '',
  p1name: '',
  p1score: '',
  p2name: '',
  p2score: '',
  APIresults:'',
  games:''
};

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'read':
      return {
        ...state,
        APIresults: action.APIresults,
      };
    case 'update-text':
      return {
        ...state,
        text: action.text,
      };
	case 'update-p1n':
      return {
        ...state,
        p1name: action.p1name,
      };
	case 'update-p1s':
      return {
        ...state,
        p1score: action.p1score,
      };
	case 'update-p2n':
      return {
        ...state,
        p2name: action.p2name,
      };
	case 'update-p2s':
      return {
        ...state,
        p2score: action.p2score,
      };
    default:
      return state;
  }
};

const store = createStore(
  rootReducer,
  INITIAL_STATE,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
  return (
    <Provider store={store}>
      <div className='app'>
        <UserInput />
        <div className='results'>
          <GameData />
        </div>
      </div>
    </Provider>
  );
}

function UserInput() {
  const text = useSelector(state => state.text);
  const p1name = useSelector(state => state.p1name);
  const p1score = useSelector(state => state.p1score);
  const p2name = useSelector(state => state.p2name);
  const p2score = useSelector(state => state.p2score);

  const dispatch = useDispatch();

  const updateP1Name = (e) => dispatch({
    type: 'update-p1n',
    p1name: e.target.value,
  });
  
    const updateP1Score = (e) => dispatch({
    type: 'update-p1s',
    p1score: e.target.value,
  });
  
    const updateP2Name = (e) => dispatch({
    type: 'update-p2n',
    p2name: e.target.value,
  });
  
    const updateP2Score = (e) => dispatch({
    type: 'update-p2s',
    p2score: e.target.value,
  });

  const addGame = async () => {
    const xAPIresults = await APIRequest('game', p1name, p1score, p2name, p2score);
    //const sentimentsResult = await textAnalyticsRequest('game', text);

    dispatch({
      type: 'read',
      APIresults: xAPIresults.data[1],
      //sentiments: sentimentsResult.sentences,
    });
  };

  return (
    <section>
      <h2>Ping Pong Tally</h2>
		Player #1 Name: <input autoFocus onChange={updateP1Name}></input>
		Player #1 Score: <input autoFocus onChange={updateP1Score}></input>
	   
		Player #2 Name: <input autoFocus onChange={updateP2Name}></input>
		Player #2 Score: <input autoFocus onChange={updateP2Score}></input>
	  
      <div><button onClick={addGame}>Add Game Results</button></div>
    </section>
  );
}

function GameData() {
  const tabledata = useSelector(state => state.APIresults);
  

console.log(tabledata);

//console.log("333 "+tabledata.isArray)
try{
 return (
    <section>
      <h2>Game Results</h2>
      <p>
        {tabledata && tabledata.map(({ tabledatar, offset, length }) => {
          const subtext = tabledatar[offset];
          
          return <span key={offset} >d{subtext} </span>;
        })}
      </p>
    </section>
  );
  
}
catch(e){ 
console.log(e);
return (
    <section>
      <h2>Game Results</h2>
    </section>
  );};
}

function KeyPhraseList() {
  const phrases = useSelector(state => state.phrases);

  return (
    <section>
      <h2>Key Phrases</h2>
      {phrases &&
        <ul>
          {phrases.map(phrase => (
            <li key={phrase}>{phrase}</li>
          ))}
        </ul>
      }
    </section>
  );
}

async function APIRequest(endpoint, p1name, p1score, p2name, p2score) {

  const url = "http://localhost:3001/" + endpoint;
  const response = await fetch(url, {
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "accept": "application/json"
    },
    "body": JSON.stringify({
      "p1name": p1name,
	  "p1score": p1score,
      "p2name": p2name,
      "p2score": p2score,
    }),
  });
  const body = await response.json();
  //console.log(body);
  return body;
}

export default App;