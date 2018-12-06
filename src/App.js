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

 {/*データベースから取り出して<li>に追加*/}
      const koko = document.getElementById('koko');

      // const sort =function(a,b){
      //   return (a.created < b.created ? 1 : -1);
      // };

      collection.orderBy('created').get()
      .then(snapshot =>{
      snapshot.forEach(doc => {
      const li = document.createElement('li');
      console.log(doc.id, '=>', doc.data());
      li.innerHTML = `<div class="line-bc">
                      <div class="balloon6">
                       <div class="faceicon">
                        <img src="favicon.ico">
                        ${doc.data().user}
                       </div>
                       <div class="chatting">
                        <div class="says">
                          <p>${doc.data().text}</p>
                        </div>
                       </div>
                      </div>
                      </div>`

      koko.appendChild(li);
      });




    });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], user: '', text: '' };
    this.tweet = this.tweet.bind(this);
    this.userName = this.userName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);



  }

  render() {
    return (
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
          >
            つぶやく
          </button>
        </form>
      </div>
    );
  }

  tweet(event) {
    this.setState({ text: event.target.value });
  }
  userName(event){
    this.setState({ user: event.target.value});
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
{/*データベースから取り出して<li>にリアルタイムで追加*/}
    collection.orderBy('created').get()
      .then(doc => {
      const li = document.createElement('li');
     {/* li.innerHTML = `${newItem.user+newItem.text}`*/}
      li.innerHTML = `<div class="line-bc">
                      <div class="balloon6">
                       <div class="faceicon">
                       <img src="favicon.ico">
                        ${newItem.user}
                       </div>
                       <div class="chatting">
                        <div class="says">
                          <p>${newItem.text}</p>
                        </div>
                       </div>
                      </div>
                      </div>`
      koko.appendChild(li);
      });
  }
}



export default App;
