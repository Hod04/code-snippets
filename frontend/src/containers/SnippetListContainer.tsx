import * as React from "react";
import { hot } from "react-hot-loader/root";
import { connect } from "react-redux";
import { fetchSnippetLists } from "../store/snippetLists/actions";
import SideMenu from "./SideMenu";

interface snippetList {
  title?: string;
  id?: number;
}

interface Props {
  fetchSnippetLists?: () => {};
  snippetLists: snippetList[];
}

interface State {
  snippetLists?: snippetList[];
}

class SnippetListContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSnippetLists && this.props.fetchSnippetLists();
  }

  renderList() {
    const { snippetLists } = this.props;
    return (
      snippetLists &&
      snippetLists.map((list: any) => (
        <div key={list.id}>
          <h2>{list.title}</h2>
        </div>
      ))
    );
  }
  render() {
    return (
      <div>
        <SideMenu />
        {this.renderList()}
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    snippetLists: state.snippetLists || [{}]
  };
};

export default connect(mapStateToProps, { fetchSnippetLists })(
  hot(SnippetListContainer)
);
