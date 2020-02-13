import * as React from "react";
import { hot } from "react-hot-loader/root";
import { connect } from "react-redux";
import {
  fetchSnippetLists,
  createSnippetList,
  deleteSnippetList
} from "../store/snippetLists/actions";
import { fetchSnippetItems } from "../store/snippetItem/actions";
import SnippetItems from "./SnippetItems";
import {
  Button,
  ButtonGroup,
  H2,
  Spinner,
  Portal,
  Icon
} from "@blueprintjs/core";
import * as _ from "lodash";

interface SnippetList {
  title: string;
  id: number;
}

export interface SnippetItem {
  title: string;
  id: number;
  code?: string;
}

interface Props {
  fetchSnippetLists: () => {};
  createSnippetList: (title: string) => void;
  deleteSnippetList: (id: number) => void;
  fetchSnippetItems: (id: number) => {};
  snippetLists: SnippetList[];
  snippetItems: SnippetItem[];
}

interface State {
  snippetLists: SnippetList[];
  snippetItems: SnippetItem[];
  isLoading: boolean;
  showAddListInput: boolean;
  newSnippetListTitle?: string;
  activeSnippetItemKey?: number;
}

class SnippetListContainer extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    snippetLists: [],
    snippetItems: [],
    showAddListInput: false
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    !_.isEqual(prevProps, this.props) || !_.isEqual(prevState, this.state)
      ? this.fetchData()
      : {};
  }

  toggleAddList = () =>
    this.setState({ showAddListInput: !this.state.showAddListInput });

  assignNewSnippetListTitle = (title: string) =>
    this.setState({ newSnippetListTitle: title });

  handleCreateSnippetList = () => {
    const { newSnippetListTitle } = this.state;
    this.setState({ isLoading: true });
    newSnippetListTitle != null &&
      this.props.createSnippetList(newSnippetListTitle);
    this.setState({ isLoading: false, newSnippetListTitle: "" }, () =>
      this.toggleAddList()
    );
  };

  handleSnippetListClick = (id: number) => {
    this.setState({ activeSnippetItemKey: id });
    this.props.fetchSnippetItems(id);
  };

  fetchData = () => {
    this.setState({ isLoading: true });
    this.props.fetchSnippetLists();
    this.setState({ isLoading: false });
  };

  renderSnippetLists() {
    const { snippetLists } = this.props;
    return (
      !_.isEmpty(snippetLists) &&
      snippetLists.map((list: SnippetList) => {
        const isActive: boolean = this.state.activeSnippetItemKey === list.id;
        const cssProps = isActive
          ? { backgroundColor: "#394b59", color: "white" }
          : {};
        return (
          <Button
            minimal
            style={{
              marginLeft: 20,
              padding: "5px 50px 5px 20px",
              ...cssProps
            }}
            key={list.id}
            active={isActive}
            onClick={() => this.handleSnippetListClick(list.id)}
          >
            {/* <Icon
              onClick={() => this.props.deleteSnippetList(list.id)}
              icon={"trash"}
            /> */}
            <Icon icon={"code"} style={{ marginRight: 10 }} />
            <strong>{list.title}</strong>
          </Button>
        );
      })
    );
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        {this.state.isLoading && (
          <Portal>
            <Spinner />
          </Portal>
        )}
        <div style={{ width: "max-content" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <H2 style={{ padding: 20 }}>
              {"My Lists"}
              <Button
                icon={"plus"}
                minimal
                onClick={() => this.toggleAddList()}
              />
            </H2>
            {this.state.showAddListInput && (
              <>
                <form onSubmit={this.handleCreateSnippetList}>
                  <strong style={{ marginRight: 10 }}>{"Title:"}</strong>
                  <input
                    value={this.state.newSnippetListTitle}
                    type="text"
                    required
                    placeholder={"Add a title"}
                    onChange={e =>
                      this.assignNewSnippetListTitle(e.target.value)
                    }
                  />
                </form>
              </>
            )}
          </div>
          <ButtonGroup vertical>{this.renderSnippetLists()}</ButtonGroup>
        </div>
        {!_.isEmpty(this.props.snippetItems) && (
          <SnippetItems snippetItems={this.props.snippetItems} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    snippetLists: Array.from(state.snippetLists),
    snippetItems: Array.from(state.snippetItems)
  };
};

export default connect(mapStateToProps, {
  fetchSnippetLists,
  createSnippetList,
  deleteSnippetList,
  fetchSnippetItems
})(hot(SnippetListContainer));
