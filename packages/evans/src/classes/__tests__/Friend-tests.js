import Document from 'classes/Document';
import Friend from 'classes/Friend';

describe('Friend', () => {
  let friend;

  beforeEach(() => {
    friend = new Friend();
  });

  describe('toJSON()', () => {
    it('removes circular reference to documents[*].friend', () => {
      const document = new Document();
      document.friend = friend;
      friend.documents.push(document);

      const json = JSON.parse(JSON.stringify(friend));

      expect(json.documents[0].friend).toBeUndefined();
    });
  });
});
