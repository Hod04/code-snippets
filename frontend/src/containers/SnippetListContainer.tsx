import * as React from "react";
import { hot } from "react-hot-loader/root";
import { connect } from "react-redux";
import {
  fetchSnippetLists,
  createSnippetList,
  deleteSnippetList
} from "../store/snippetLists/actions";
import {
  fetchSnippetItems,
  clearSnippetItemsList,
  createSnippet,
  updateSnippet
} from "../store/snippetItem/actions";
import SnippetItems from "../components/SnippetItems";
import {
  Button,
  ButtonGroup,
  H2,
  Spinner,
  Portal,
  Icon,
  Toast
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
  deleteSnippetList: (listId: number) => void;
  fetchSnippetItems: (listId: number) => {};
  createSnippet: (listId: number, snippetTitle: string) => {};
  clearSnippetItemsList: () => void;
  updateSnippet: (listId: number, snippetId: number, code: string) => void;
  snippetLists: SnippetList[];
  snippetItems: SnippetItem[];
}

interface State {
  snippetLists: SnippetList[];
  snippetItems: SnippetItem[];
  isLoading: boolean;
  showAddListInput: boolean;
  showAddSnippetInput: boolean;
  newSnippetListTitle?: string;
  newSnippetTitle?: string;
  activeSnippetListKey?: number;
}

class SnippetListContainer extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    snippetLists: [],
    snippetItems: [],
    showAddListInput: false,
    showAddSnippetInput: false
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // @TODO: introduce more constraints to fetching
    !_.isEqual(prevProps, this.props) ? this.fetchData() : {};
  }

  toggleAddList = () =>
    this.setState(
      {
        showAddListInput: !this.state.showAddListInput,
        activeSnippetListKey: undefined
      },
      () => this.props.clearSnippetItemsList()
    );

  toggleAddSnippet = () => {
    if (this.state.activeSnippetListKey == null) {
      <Toast
        message={"Please choose a snippet list you wish to add a snippet to"}
      />;
      return;
    }
    this.setState({
      showAddSnippetInput: !this.state.showAddSnippetInput
    });
  };

  assignNewSnippetListTitle = (title: string) =>
    this.setState({ newSnippetListTitle: title });

  assignNewSnippetTitle = (title: string) =>
    this.setState({ newSnippetTitle: title });

  handleCreateSnippetList = () => {
    const { newSnippetListTitle } = this.state;
    this.setState({ isLoading: true });
    newSnippetListTitle != null &&
      this.props.createSnippetList(newSnippetListTitle);
    this.setState({ isLoading: false, newSnippetListTitle: "" }, () =>
      this.toggleAddList()
    );
  };

  handleCreateSnippet = () => {
    const { newSnippetTitle } = this.state;
    const { activeSnippetListKey } = this.state;
    if (activeSnippetListKey == null) {
      <Toast
        message={"Please choose a snippet list you wish to add a snippet to"}
      />;
      return;
    }
    this.setState({ isLoading: true });
    newSnippetTitle != null &&
      this.props.createSnippet(activeSnippetListKey, newSnippetTitle);
    this.setState({ isLoading: false, newSnippetTitle: "" }, () =>
      this.toggleAddSnippet()
    );
  };

  handleSnippetListClick = (listId: number) => {
    this.state.activeSnippetListKey !== listId
      ? this.setState({ activeSnippetListKey: listId, isLoading: true }, () => {
          this.props.fetchSnippetItems(listId);
          this.setState({ isLoading: false });
        })
      : this.setState({ activeSnippetListKey: undefined }, () =>
          this.props.clearSnippetItemsList()
        );
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
        const isActive: boolean = this.state.activeSnippetListKey === list.id;
        const cssProps = isActive
          ? { backgroundColor: "#394b59", color: "white" }
          : {};
        return (
          <Button
            disabled={
              this.state.showAddListInput || this.state.showAddSnippetInput
            }
            minimal
            style={{
              marginLeft: 20,
              padding: "5px 50px 5px 10px",
              display: "block",
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
        <div style={{ display: "flex", padding: "30px 0 0 30px" }}>
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
                  icon={
                    this.state.showAddListInput === false ? "plus" : "minus"
                  }
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
                      onChange={(e: any) =>
                        this.assignNewSnippetListTitle(e.target.value)
                      }
                    />
                  </form>
                </>
              )}
            </div>
            <ButtonGroup vertical>{this.renderSnippetLists()}</ButtonGroup>
          </div>
        </div>

        {this.state.showAddListInput === false && (
          <div style={{ marginLeft: 200 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <H2 style={{ padding: "50px 20px 20px 0px" }}>
                {"Code Snippets"}
                <Button
                  icon={
                    this.state.showAddSnippetInput === false ? "plus" : "minus"
                  }
                  minimal
                  onClick={() => this.toggleAddSnippet()}
                />
              </H2>
              {this.state.showAddSnippetInput && (
                <form onSubmit={this.handleCreateSnippet}>
                  <strong style={{ marginRight: 10 }}>{"Title:"}</strong>
                  <input
                    value={this.state.newSnippetTitle}
                    type="text"
                    required
                    placeholder={"Add a title"}
                    onChange={e => this.assignNewSnippetTitle(e.target.value)}
                  />
                </form>
              )}
            </div>
            {!_.isEmpty(this.props.snippetItems) &&
              this.state.activeSnippetListKey != null && (
                <SnippetItems
                  fetchSnippetItems={this.props.fetchSnippetItems}
                  newSnippetFormActive={this.state.showAddSnippetInput}
                  snippetItems={this.props.snippetItems}
                  updateSnippet={this.props.updateSnippet}
                  activeSnippetListKey={this.state.activeSnippetListKey}
                />
              )}
          </div>
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
  fetchSnippetItems,
  clearSnippetItemsList,
  createSnippet,
  updateSnippet
})(hot(SnippetListContainer));
