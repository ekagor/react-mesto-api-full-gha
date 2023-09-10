const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = require('http2').constants;
const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// методы mongo
// пустой объект метода find ({}) вернет все объекты из базы
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next);
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

// Метод orFail() в Mongoose используется для проверки, был ли найден документ в базе данных
// если документ не найден, то метод orFail() выбрасывает ошибку DocumentNotFoundError
// это позволяет избежать дополнительного if оператора для проверки наличия документа
// и сразу перейти к обработке ошибки в блок catch.
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Карточка не найдена'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

// Опция `{ new: true }` указывает, что нужно вернуть обновленный документ.
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный _id карточки'));
      } else {
        next(err);
      }
    });
};
