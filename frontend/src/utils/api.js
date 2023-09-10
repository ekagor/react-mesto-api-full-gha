class Api {
  constructor(options) {
    this._url = options.baseUrl;    
  }

  _serviceMethod(res) {return res.ok ? res.json() : Promise.reject}

  getInfo(token) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(this._serviceMethod)
  }

  getCards(token) {
    return fetch(`${this._url}/cards`, {
      headers: {        
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(this._serviceMethod)
  }

  setUserInfo(data, token) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',      
      headers: {
        'Content-Type': 'application/json',
        "Authorization" : `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.username,
        about: data.profession,
      })
    })
    .then(this._serviceMethod)
  }

  setNewAvatar(data, token) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',      
      headers: {
        'Content-Type': 'application/json',
        "Authorization" : `Bearer ${token}`
      },
      body: JSON.stringify({
        avatar: data.avatar,
      })
    })
    .then(this._serviceMethod)
  }

  addCard(data, token) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',      
      headers: {
        'Content-Type': 'application/json',
        "Authorization" : `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.place,
        link: data.link,
      })
    })
    .then(this._serviceMethod)
  }

  addLike(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(this._serviceMethod)
  }

  deleteLike(cardId, token) {
    return fetch (`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(this._serviceMethod)
  }

  deleteCard(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(this._serviceMethod)
  }
}

const api = new Api({
  baseUrl: 'https://api.katy.nomoredomainsicu.ru',
});
export default api