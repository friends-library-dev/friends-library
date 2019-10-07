const fs = require('fs');
const { getAllFriends } = require('@friends-library/friends');

const friends = JSON.stringify(getAllFriends());
let head = fs.readFileSync(`${__dirname}/.storybook/preview-head.pre.html`).toString();
head = head.replace("'FRIENDS_JSON'", friends);

fs.writeFileSync(`${__dirname}/.storybook/preview-head.html`, head);
fs.writeFileSync(
  `${__dirname}/.storybook/manager-head.html`,
  `window.FRIENDS = ${friends};`,
);
