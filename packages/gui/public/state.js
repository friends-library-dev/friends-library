const task = {
  id: 'abc-123',
  name: 'My Rad Task',
  repoId: 234234234,
  isNew: false,
  collapsed: {
    'journal/modernized': true,
    'journal/original': false,
  },
  documentTitles: {
    'journal': 'Journal of George Fox',
  },
  files: {
    'journal/modernized/01-chapter-1.adoc': {
      sha: 'a6154321acf0a70eebc7f77c90ea2988d372612e',
      path: 'journal/modernized/01-chapter-1.adoc',
      content: '== Chapter 1\n\nThou Foobar.',
      editedContent: '== Chapter 1\n\nYou Foobar.',
    },
    // ... many more ...
  }
  parentCommit: 'a6154321acf0a70eebc7f77c90ea2988d372612e',
  editingFile: 'journal/modernized/01-chapter-1.adoc'
}
