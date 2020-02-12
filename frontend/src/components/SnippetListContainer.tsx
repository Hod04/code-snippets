import * as React from "react";
import { hot } from "react-hot-loader/root";
import { connect } from "react-redux";
import {
  fetchSnippetLists,
  createSnippetList,
  deleteSnippetList
} from "../store/snippetLists/actions";
import { Button, ButtonGroup, H2, Spinner, Portal } from "@blueprintjs/core";
import * as _ from "lodash";

interface snippetList {
  title?: string;
  id?: number;
}

interface Props {
  fetchSnippetLists: () => {};
  createSnippetList: (title: string) => void;
  deleteSnippetList: (id: string) => void;
  snippetLists: snippetList[];
}

interface State {
  snippetLists: snippetList[];
  isLoading: boolean;
}

class SnippetListContainer extends React.Component<Props, State> {
  state: State = { isLoading: false, snippetLists: [] };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    !_.isEqual(prevProps, this.props) || !_.isEqual(prevState, this.state)
      ? this.fetchData()
      : {};
  }

  fetchData = () => {
    this.setState({ isLoading: true });
    this.props.fetchSnippetLists();
    this.setState({ isLoading: false });
  };

  renderList() {
    const { snippetLists } = this.props;
    return (
      !_.isEmpty(snippetLists) &&
      snippetLists.map((list: any) => (
        <div style={{ display: "flex" }}>
          <Button
            key={`${list.id}`}
            text={list.title}
            icon={"dot"}
            // onClick={showSnippetItem}
          />
          <Button
            key={`${list.title}/${list.id}`}
            onClick={() => this.props.deleteSnippetList(list.id)}
            icon={"trash"}
          />
        </div>
      ))
    );
  }
  render() {
    return (
      <>
        {this.state.isLoading && (
          <Portal>
            <Spinner />
          </Portal>
        )}
        <H2 style={{ padding: 20 }}>
          {"My Lists"}
          <Button
            icon={"plus"}
            minimal
            onClick={() =>
              this.props.createSnippetList(
                `test ${this.props.snippetLists.length + 1}`
              )
            }
          />
        </H2>
        <ButtonGroup
          minimal
          vertical
          className={this.state.isLoading ? "bp3-skeleton" : ""}
        >
          {this.renderList()}
        </ButtonGroup>
      </>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    snippetLists: Array.from(state.snippetLists)
  };
};

export default connect(mapStateToProps, {
  fetchSnippetLists,
  createSnippetList,
  deleteSnippetList
})(hot(SnippetListContainer));
