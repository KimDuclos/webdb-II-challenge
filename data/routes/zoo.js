const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../../knexfile');
// const zooDB = knex(knexConfig.development);

router.get('/', (req, res) => {
    zooDB('zoos')
      .then(zoos => {
        res.json(zoos);
      })
      .catch(error => {
        res
          .status(500).json({ errorMessage: 'Can not get bears from database.' });
      });
  });
  
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    zooDB('zoos')
      .where('id', id)
      .then(rows => {
        res.json(rows);
      })
      .catch(() => {
        res.status(500).json({ errorMessage: 'No bear with this ID exists.' });
      });
  });
  
  router.post('/', (req, res) => {
    const zoo = req.body;
    if (zoo.name) {
      zooDB('zoos')
        .insert(zoo)
        .then(ids => {
          res.status(201).json(ids);
        })
        .catch(() => {
          res
            .status(500)
            .json({ errorMessage: 'Cannot add bear to database.' });
        });
    } else {
      res.status(400).json({ errorMessage: 'Name required to insert zoo into the DB.' });
    }
  });
  
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const zoo = req.body;
  
    if (zoo.name) {
      zooDB('zoos')
        .where('id', id)
        .update(zoo)
        .then(zooCount => {
          res.status(200).json('This zoo has been updated.');
        })
        .catch(err => {
          res.status(500).json({ errorMessage: 'Zoo could not be updated.' });
        });
    } else {
      res.status(400).json({ errorMessage: 'Please provide a name for the zoo.' });
    }
  });
  
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
  
    zooDB('zoos')
      .where({ id: id })
      .del()
      .then(count => {
        if (count > 0) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ errorMessage: 'No bear with this ID exists.' });
        }
      })
      .catch(err => {res.status(500).json(err);
      });
  });

  module.exports = router;