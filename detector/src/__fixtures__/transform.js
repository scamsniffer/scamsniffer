const raw = require('./testcase.json');
const fs = require('fs');


fs.writeFileSync('./tweets-all.json', JSON.stringify(raw.map(_ => {
    return {
      id: _.id + "",
      nickname: _.nickname,
      content: _.content,
      userId: _.twitter,
      links: [_.link]
    };
})))