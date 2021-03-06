const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Skills } = require('../../models/');
const withAuth = require('../../utils/auth');
const { post } = require('./user-routes');

// get all skills
router.get('/skill', withAuth, (req, res) => {
    Skills.findAll({
      where: {
        user_id: req.session.user_id
      }
    })
    .then(dbSkillsData => res.json(dbSkillsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get one skill
router.get('/skill/:id', (req, res) => {
    Skills.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbSkillsData => res.json(dbSkillsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// post new skill
router.post('/', withAuth, (req, res) => {
  if (req.session) {
    Skills.create({
        title: req.body.title,
        status: req.body.status,
        user_id: req.session.user_id
    })
    .then(dbSkillsData => res.json(dbSkillsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
  }
});

// put request - edit skill
router.put('/api/skill/:id', withAuth, (req, res) => {
  if (req.session) {
    // pass session id along with all destructured properties on req.body
      Skills.update(
          {
          title: req.body.title,
          status: req.body.status
        },
        {
          where: {
            id: req.params.id
          }
        }
      )
        .then(dbSkillsData => {
          if (!dbSkillsData) {
            res.status(404).json({ message: 'No skill found with this id' });
            return;
          }
          res.json(dbSkillsData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
      }
    });
 

// delete skill
router.delete('/api/skill/:id', withAuth, (req, res) => {
  if (req.session) {
  Skills.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbSkillsData => {
      if (!dbSkillsData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbSkillsData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  }
});

// route to edit skills
router.get('/edit/:id', (req, res) => {
    Skills.findByPk(req.params.id, {
        attributes: [
            'id',
            'title',
            'status'
        ]
    })
    .then(dbSkillsData => {
        if (dbSkillsData) {
            const skill = dbSkillsData.get({ plain: true });

            res.render('edit-skill', {
                skill,
                // loggedIn: true
            });
        } else {
            res.status(404).end();
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});


module.exports = router;
