import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase/app';
import firestore from 'firebase/firestore';
import config from './fb-config.js';



firebase.initializeApp(config);
  const db = firebase.firestore();
    db.settings({
        timestampsInSnapshots: true
    });
  const collection = db.collection('tweets');






class App extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], user: '', text: '' };
    this.tweet = this.tweet.bind(this);
    this.userName = this.userName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.scrollTop = this.scrollTop.bind(this);


  }

  render() {
    return (
      <div>
      <div className="container">
        <form onSubmit={this.handleSubmit}
              autoComplete="off">
          <input
            onChange={this.userName}
            value={this.state.user}
            id='tweets'
            placeholder="あなたの名前"
          /><br/>
          <textarea
            id="new-todo"
            onChange={this.tweet}
            value={this.state.text}
            placeholder="今何してる？"
          /><br/>
          <button
            className="btn btn-success"
            type="submit"
          >つぶやく
          </button>
        </form>
    </div>
      {/*  TweetList Componentの呼び出し */}
        <div className="tweet-list">
        <TweetList items={this.state.items} />
        <div style={{textAlign: "center"}}>
        <button
          className="btn btn-top"
          style={{marginBottom:"10px"}}
          onClick={this.scrollTop}
          >Topへ
        </button>
        </div>
        </div>
      </div>
    );
  }

  tweet(event) {
    this.setState({ text: event.target.value });
  }
  userName(event){
    this.setState({ user: event.target.value});
  }

  componentWillMount() {
   collection.orderBy('created').get()
   .then(snapshot =>{
    snapshot.docs.map(doc => {
    console.log(doc.data());

    const allItems = {
      user: doc.data().user,
      text: doc.data().text,
      created: doc.data().created,
    }

    this.setState(state => ({
      items: state.items.concat(allItems),
      user: '',
      text: ''
    }));

     });
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.user === "") {
      alert('ユーザー名を入力してください')
      return;
    } else if(this.state.text === "") {
      alert('ツイート内容を入力してください')
      return;
    }

    const newItem = {
      user: this.state.user,
      text: this.state.text,
      created: firebase.firestore.FieldValue.serverTimestamp()
    };


  {/*データベースに入れる*/}
    collection.add({
        user: this.state.user,
        text: this.state.text,
        created: firebase.firestore.FieldValue.serverTimestamp()

    })
      .then(doc => {
        console.log(`${doc.id}をDBに追加したよ!`);
      })
      .catch(error =>{
        console.log(error);
      });

      this.setState(state => ({
      items: state.items.concat(newItem),
      user: '',
      text: ''
    }));
       document.getElementById("bottom").scrollIntoView(true)
  }

  scrollTop() {
    window.scrollTo( 0, 0 );
  }

}

class TweetList extends React.Component {
  render() {
    return (
      <div>
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>
          <div className="line-bc">
            <div className="balloon6">
              <div className="faceicon">
                <img src="favicon.ico"/>
                  {item.user}
              </div>
              <div className="chatting">
                <div className="says">
                  <p>{item.text}</p>
                </div>
              </div>
            </div>
          </div>
          </li>
        ))}
      </ul>
      <span id="bottom"></span>
      </div>
    );
  }
}



export default App;
