const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../../knexfile');
const zooDB = knex(knexConfig.development);


// GET - all bears
router.get('/', (req, res) => {
    zooDB('bears')
      .then(bears => {
        res.status(200).json(bears);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: err });
      });
  });
  

  // GET -bears by ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    zooDB('bears')
      .where('id', id)
      .then(bear => {
        if (bear.length) {
          res.status(200).json(bear);
        } else {
          res.status(404).json({ errorMessage: 'A bear with this ID does not exist.' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'Error getting bear from database' });
      });
  });
  

  // POST -  add bear to database
  router.post('/', (req, res) => {
    const bear = req.body;
    if (!bear.name) {
      res.status(404).json({ errorMessage: 'Please provide complete bear name.' });
      return;
    }
    zooDB('bears')
      .insert(bear)
      .then(id => {
        res.status(201).json(id);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: 'Bear cannot be added to the database.', err });
      });
  });
  

  // PUT - edit by ID
  router.put('/:id', (req, res) => {
    const bear = req.body;
    const { id } = req.params;
    if (!bear.name || !id) {
      res.status(404).json({ errorMessage: 'Please provide bear name.' });
      return;
    }
    zooDB('bears')
      .where('id', id)
      .update(bear)
      .then(id => {
        if (id) {
          res.status(201).json(id);
        } else {
          res.status(404).json({ errorMessage: 'The bear with the specified ID does not exist.' });
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: 'The bear could not be updated' });
      });
  });
  

  // DELETE by ID
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    zooDB('bears')
      .where('id', id)
      .del()
      .then(count => {
        if (count) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ errorMessage: 'No bear with this ID exists.' });
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: 'The bear could not be deleted' });
      });
  });

  module.exports = router;