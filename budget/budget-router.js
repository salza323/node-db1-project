const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

//db helpers
const Budget = {
  getAll() {
    return db('accounts');
  },
  getById(id) {
    return db('accounts').where({ id });
  },
  create(account) {
    return db('accounts').insert(account);
  },
  update(id, account) {
    return db('accounts').where({ id }).update(account);
  },
  delete(id) {
    return db('accounts').where({ id }).del();
  },
};

//crud operations
router.get('/', (req, res) => {
  Budget.getAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

// this did not work when sending through postman
// router.get('/:id', (req, res) => {
//   Budget.getById(req.params.id)
//     .then((data) => {
//       if (!data.length) {
//         res
//           .status(404)
//           .json({ message: 'No account with that ID found in database.' });
//       } else {
//         res.status(200).json(data[0]);
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ message: error.message });
//     });
// });

//tested, works
router.get('/:id', (req, res) => {
  Budget.getById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// ******server not taking data when sent like this: need to figure out why. (sent as json on postman)
// {
//     "name": "account-19",
//     "budget": "54.5"
// }
router.post('/', (req, res) => {
  Budget.create(req.body)
    // .then(([id]) => {
    //   return Budget.getById(id).first();
    // })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// getting this error message:
// {
//     "message": "Cannot convert undefined or null to object"
// }
router.put('/:id', async (req, res) => {
  try {
    await Budget.update(req.params.id, req.body);
    const updatedAccount = await Budget.getById(req.params.id).first();
    res.json(updatedAccount);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//tested, works
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsNumber = await Budget.delete(req.params.id);
    if (!deletedRowsNumber) {
      res.json({ message: 'No account with that ID' });
    } else {
      res.json({ message: 'Account has been removed' });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
