require('dotenv').config();

import Notes from './controllers/notes';
import {create} from './modules/server/server';
import {ignoreFavicon, setJsonApp} from './modules/middlewares';

const router = create();

router.use(ignoreFavicon);
router.use(setJsonApp);

router.get('/', (req, res) => {
  res.write(JSON.stringify({
    testing: 1
  }));
});

router.route('/getAll', Notes.getAll);

router.defaultRoute((req, res) => {
  res.write(JSON.stringify({
    error: "invalid Request"
  }));
})

router.serve(3000);

