// @flow
/** @jsx jsx */
import * as React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import styled from '@emotion/styled/macro';
import { jsx, css } from '@emotion/core';
import type { Uuid } from '../../../../type';
import type { Dispatch, FilePath } from '../type';
import * as actions from '../actions';
import { documentTree, currentTask } from '../select';

const wrap = css`
  margin: 0;
  padding: 1.5em;

  & .search {
    display: none;
    position: absolute;
    top: 4px;
    right: -28px;
  }

  & .parent:hover .search {
    display: block;
  }

  & > li {
    margin-bottom: 9px;
  }

  & li {
    white-space: nowrap;
    list-style: none;
  }

  & > li > ul {
    padding-left: 20px;
  }

  & li.collapsed > ul {
    display: none;
  }

  & .toggler::before {
    cursor: pointer;
    width: 11px;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    content: "\f0d7";
    color: var(--accent);
    margin-right: 0;
  }

  & .collapsed .toggler::before {
    content: "\f0da";
  }
`;

const editionLi = css`
  margin-top: 0.5em;
  white-space: nowrap;

  & > span {
    text-transform: capitalize;
  }

  & > ul {
    margin: 0.35em 0 0.75em;
    padding-left: 2em;
  }
`;

const Filename = styled.li`
  margin: 6px;

  &::before {
    content: "• ";
    opacity: 0;
    color: orange;
  }

  &.edited::before {
    opacity: 1;
  }

  & code {
    font-size: 13px;
    cursor: pointer;
    padding: 2px 8px;
    background: #232323;
    &:hover {
      background: #000;
    }
  }

  &.editing {
    & code {
      color: #000;
      cursor: default;
      background: var(--accent);
    }
  }
`;

const IconSearch = styled.i`
  padding-left: 10px;

  &::before {
    width: 11px;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    content: ${(props) => props.isEdition ? '"\f02e"' : '"\f02d"'};
    margin-right: 0.75em;
    color: #999;
  }

  &:hover::before {
    content: "\f002";
    color: white;
  }
`;


type Props = {|
  taskId: Uuid,
  collapsed: Object,
  editingFile: FilePath,
  updateTask: Dispatch,
  collapseTask: Dispatch,
  updateSearch: Dispatch,
  documents: Array<*>,
|};

class FriendFiles extends React.Component<Props> {
  search(path) {
    const { updateSearch } = this.props;
    const [documentSlug, editionType] = path.split('/');
    updateSearch({
      searching: true,
      documentSlug: documentSlug || null,
      editionType: editionType || null,
      filename: null,
    });
  }

  isCollapsed(key: string): boolean {
    const { collapsed, editingFile } = this.props;

    // ensure editing file is always visible, because we can
    // jump to a collapsed section from the search feature
    if (editingFile && editingFile.indexOf(key) === 0) {
      return false;
    }

    return collapsed[key] || false;
  }

  renderDoc = (doc) => {
    const { collapseTask, taskId } = this.props;
    const key = doc.slug;
    const isCollapsed = this.isCollapsed(key);
    return (
      <li
        key={doc.slug}
        className={cx('parent', { collapsed: isCollapsed })}
      >
        <span
          className="toggler"
          onClick={() => collapseTask({ taskId, key, isCollapsed })}
        />
        <IconSearch onClick={() => this.search(key)} />
        {doc.title}
        <ul>
          {doc.editions.map(ed => this.renderEdition(ed, doc))}
        </ul>
      </li>
    );
  }

  renderEdition = (ed, doc) => {
    const { collapseTask, taskId } = this.props;
    const key = [doc.slug, ed.type].join('/');
    const isCollapsed = this.isCollapsed(key);
    return (
      <li
        key={`${doc.slug}/${ed.type}`}
        className={cx('parent', { collapsed: isCollapsed })}
        css={editionLi}
      >
        <span
          className="toggler"
          onClick={() => collapseTask({ taskId, key, isCollapsed })}
        />
        <IconSearch onClick={() => this.search(key)} isEdition />
        <span className="edition-type">{ed.type}</span> edition:
        <ul>
          {ed.files.map(file => this.renderFile(file, ed, doc))}
        </ul>
      </li>
    );
  }

  renderFile = (file, ed, doc) => {
    const { editingFile, updateTask, taskId } = this.props;
    const editing = file.path === editingFile;
    return (
      <Filename
        key={file.filename}
        onClick={(e) => {
          e.stopPropagation();
          updateTask({ id: taskId, data: { editingFile: file.path } });
        }}
        className={cx({
          editing,
          edited: file.edited
        })}
      >
        <code>{file.filename}</code>
      </Filename>
    );
  }

  render() {
    const { documents } = this.props;
    return (
      <ul css={wrap}>
        {documents.map(this.renderDoc)}
      </ul>
    );
  }
}

const mapState = state => {
  const task = currentTask(state);
  if (!task) {
    throw new Error('task not found');
  }
  return {
    taskId: task.id,
    documents: documentTree(task),
    editingFile: task.editingFile,
    collapsed: task.collapsed || {},
  };
};

const mapDispatch = {
  updateTask: actions.updateTask,
  collapseTask: actions.collapseTask,
  updateSearch: actions.updateSearch,
};

export default connect(mapState, mapDispatch)(FriendFiles);
