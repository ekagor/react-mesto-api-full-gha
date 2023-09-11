import { useContext } from "react"
import CurrentUserContext from "../../contexts/CurrentUserContext.js"
import ButtonLike from "../buttonLike/ButtonLike.jsx"

export default function Card({ card, onCardClick, openDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext)
  return (
    <div className="card__item">
      {currentUser._id === card.owner && <button className="button card__delete-button" type="button" onClick={() => openDelete(card._id)}/>}
      <img className="card__image" 
      src={card.link} 
      alt={`Изображение ${card.name}`} onClick={() => onCardClick({link: card.link, name: card.name})} 
      />
      <div className="card__container">
        <h2 className="text card__subtitle">{card.name}</h2>on
        <div className="card__like-container">
          {/* <ButtonLike likes={card.likes} myid={currentUser._id} cardid={card._id} /> */}
          <ButtonLike myid={currentUser._id} card={card} onCardLike={onCardLike} />
        </div>
      </div>
    </div>
  )
}
